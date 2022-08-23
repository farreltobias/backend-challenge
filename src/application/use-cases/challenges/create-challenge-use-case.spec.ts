import { Test } from '@nestjs/testing';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';

describe('Create Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ChallengeRepository,
          useClass: InMemoryChallengeRepository,
        },
        CreateChallengeUseCase,
      ],
    }).compile();

    createChallengeUseCase = moduleRef.get(CreateChallengeUseCase);
  });

  it('should be able to create a Challenge', async () => {
    const response = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    expect(response).not.toBeNull();
    expect(response).toBeInstanceOf(Challenge);
  });
});
