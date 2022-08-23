import { Test } from '@nestjs/testing';

import { UseCaseError } from '@application/errors/use-case-error';

import { Challenge } from '@domain/entities/challenge';
import { Submission } from '@domain/entities/submission';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';
import { SubmissionRepository } from '@infra/database/repositories/submission.repository';
import { KafkaService } from '@infra/messaging/kafka.service';

import { InMemoryKafkaService } from '@test/messaging/in-memory-kafka.service';
import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from '@test/repositories/in-memory-submission.repository';

import { CreateChallengeUseCase } from '../challenges/create-challenge-use-case';
import { CreateSubmissionUseCase } from './create-submission-use-case';
import { PageSubmissionsUseCase } from './page-submissions-use-case';

describe('Create Submission UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let createSubmissionUseCase: CreateSubmissionUseCase;
  let pageSubmissionsUseCase: PageSubmissionsUseCase;
  let inMemoryKafkaService: InMemoryKafkaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ChallengeRepository,
          useClass: InMemoryChallengeRepository,
        },
        {
          provide: SubmissionRepository,
          useClass: InMemorySubmissionRepository,
        },
        {
          provide: KafkaService,
          useClass: InMemoryKafkaService,
        },
        CreateChallengeUseCase,
        CreateSubmissionUseCase,
        PageSubmissionsUseCase,
      ],
    }).compile();

    createChallengeUseCase = moduleRef.get(CreateChallengeUseCase);
    createSubmissionUseCase = moduleRef.get(CreateSubmissionUseCase);
    pageSubmissionsUseCase = moduleRef.get(PageSubmissionsUseCase);

    inMemoryKafkaService = moduleRef.get(KafkaService);
  });

  it('should be able to create a Submission', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const response = await createSubmissionUseCase.handle({
      challengeId: challenge.id,
      repositoryUrl: 'https://github.com/user/link-do-repositorio.git',
    });

    expect(response).not.toBeNull();
    expect(response).toBeInstanceOf(Submission);

    expect(inMemoryKafkaService.send).toHaveBeenCalledWith(
      'challenge.correction',
      {
        submissionId: response.id,
        repositoryUrl: response.repositoryUrl,
      },
    );
  });

  it('should not be able to create a Submission with an invalid challenge id', async () => {
    const createSubmission = createSubmissionUseCase.handle({
      challengeId: 'invalid-id',
      repositoryUrl: 'https://github.com/user/link-do-repositorio.git',
    });

    await expect(createSubmission).rejects.toThrow(
      new Error('Challenge not found') as UseCaseError,
    );

    const response = await pageSubmissionsUseCase.handle({
      filter: {
        status: 'ERROR',
      },
      limit: 1,
      offset: 0,
    });

    expect(response.totalCount).toBe(1);
    expect(response.nodes).not.toBeNull();

    expect(response.nodes?.[0]).toBeInstanceOf(Submission);
    expect(response.nodes?.[0].status).toBe('ERROR');
  });

  it('should not be able to create a Submission with an invalid repository url', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const createSubmission = createSubmissionUseCase.handle({
      challengeId: challenge.id,
      repositoryUrl: 'invalid-url',
    });

    await expect(createSubmission).rejects.toThrow(
      new Error('Url is not a valid GitHub repository') as UseCaseError,
    );

    const response = await pageSubmissionsUseCase.handle({
      filter: {
        status: 'ERROR',
      },
      limit: 1,
      offset: 0,
    });

    expect(response.totalCount).toBe(1);
    expect(response.nodes).not.toBeNull();

    expect(response.nodes?.[0]).toBeInstanceOf(Submission);
    expect(response.nodes?.[0].status).toBe('ERROR');

    expect(response.nodes?.[0].challenge).toBeInstanceOf(Challenge);
  });
});
