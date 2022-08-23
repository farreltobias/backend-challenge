import { Test } from '@nestjs/testing';

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

describe('Page Submission UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let createSubmissionUseCase: CreateSubmissionUseCase;
  let pageSubmissionsUseCase: PageSubmissionsUseCase;

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
        status: 'DONE',
      },
      limit: 1,
      offset: 0,
    });

    expect(response.nodes).not.toBeNull();
    expect(response.nodes?.[0]).toBeInstanceOf(Submission);

    expect(response.totalCount).toBe(1);
    expect(response.nodes?.[0].props).toEqual({
      ...submission.props,
      status: 'DONE',
      grade: expect.any(Number),
      updatedAt: expect.any(Date),
    });
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
        status: 'DONE',
        fromDate: submission.createdAt,
        toDate: submissionNotIncluded.createdAt,
      },
      limit: 2,
      offset: 0,
    });

    expect(response.nodes).not.toBeNull();

    expect(response.totalCount).toBe(1);
    expect(response.nodes?.[0].props).toEqual({
      ...submission.props,
      status: 'DONE',
      grade: expect.any(Number),
      updatedAt: expect.any(Date),
    });

    expect(response.nodes).not.toEqual<Submission[]>(
      expect.arrayContaining([
        {
          ...submissionNotIncluded,
          status: 'DONE',
          grade: expect.any(Number),
          updatedAt: expect.any(Date),
        },
      ]),
    );
  });
});
