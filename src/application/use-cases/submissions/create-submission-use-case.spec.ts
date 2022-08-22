import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { Submission } from '@domain/entities/submission';

import { KafkaService } from '@infra/messaging/kafka.service';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';
import { InMemorySubmissionRepository } from '@test/repositories/in-memory-submission.repository';

import { CreateChallengeUseCase } from '../challenges/create-challenge-use-case';
import { CreateSubmissionUseCase } from './create-submission-use-case';

describe('Create Submission UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let createSubmissionUseCase: CreateSubmissionUseCase;

  const kafkaEmit = {
    send: jest.fn(() => ({
      subscribe: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const submissionRepository = new InMemorySubmissionRepository();
    const challengeRepository = new InMemoryChallengeRepository();

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

    expect(kafkaEmit.send).toHaveBeenCalled();
  });
});
