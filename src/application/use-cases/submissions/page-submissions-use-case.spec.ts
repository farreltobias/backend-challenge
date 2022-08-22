import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { Submission } from '@domain/entities/submission';

import { KafkaService } from '@infra/messaging/kafka.service';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from '@test/repositories/in-memory-submission.repository';

import { CreateChallengeUseCase } from '../challenges/create-challenge-use-case';
import { CreateSubmissionUseCase } from './create-submission-use-case';
import { PageSubmissionsUseCase } from './page-submissions-use-case';

describe('Page Submission UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let createSubmissionUseCase: CreateSubmissionUseCase;
  let pageSubmissionsUseCase: PageSubmissionsUseCase;

  const kafkaEmit = {
    send: jest.fn(() => ({
      subscribe: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const challengeRepository = new InMemoryChallengeRepository();

    const submissionRepository = new InMemorySubmissionRepository(
      challengeRepository,
    );

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: KafkaService,
          useValue: kafkaEmit,
        },
      ],
    }).compile();

    const kafkaService = await moduleRef.resolve(KafkaService);

    createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);

    createSubmissionUseCase = new CreateSubmissionUseCase(
      challengeRepository,
      submissionRepository,
      kafkaService,
    );

    pageSubmissionsUseCase = new PageSubmissionsUseCase(submissionRepository);
  });

  it('should be able to page Submissions', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const submission = await createSubmissionUseCase.handle({
      challengeId: challenge.id,
      repositoryUrl: 'https://github.com/user/link-do-repositorio.git',
    });

    const response = await pageSubmissionsUseCase.handle({
      filter: {
        challengeId: challenge.id,
        status: 'PENDING',
        fromDate: submission.createdAt,
        toDate: submission.createdAt,
      },
      limit: 1,
      offset: 0,
    });

    expect(response.nodes).not.toBeNull();
    expect(response.nodes?.[0]).toBeInstanceOf(Submission);

    expect(response.totalCount).toBe(1);
    expect(response.nodes).toEqual<Submission[]>([submission]);
  });

  it('should be able to filter Submissions in pager', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const challengeNotFiltered = await createChallengeUseCase.handle({
      title: 'Other Challenge Example',
      description: 'Other Description example',
    });

    const submission = await createSubmissionUseCase.handle({
      challengeId: challenge.id,
      repositoryUrl: 'https://github.com/user/link-do-repositorio.git',
    });

    const submissionNotIncluded = await createSubmissionUseCase.handle({
      challengeId: challengeNotFiltered.id,
      repositoryUrl: 'https://github.com/user/link-do-repositorio.git',
    });

    const response = await pageSubmissionsUseCase.handle({
      filter: {
        challengeId: challenge.id,
        status: 'PENDING',
        fromDate: submission.createdAt,
        toDate: submissionNotIncluded.createdAt,
      },
      limit: 2,
      offset: 0,
    });

    expect(response.nodes).not.toBeNull();

    expect(response.totalCount).toBe(1);
    expect(response.nodes).toEqual<Submission[]>(
      expect.arrayContaining([submission]),
    );

    expect(response.nodes).not.toEqual<Submission[]>(
      expect.arrayContaining([submissionNotIncluded]),
    );
  });
});
