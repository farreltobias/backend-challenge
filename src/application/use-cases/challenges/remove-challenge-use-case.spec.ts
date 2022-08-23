import { Test } from '@nestjs/testing';

import { UseCaseError } from '@application/errors/use-case-error';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';
import { PageChallengesUseCase } from './page-challenges-use-case';
import { RemoveChallengeUseCase } from './remove-challenge-use-case';

describe('Remove Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let removeChallengeUseCase: RemoveChallengeUseCase;
  let pageChallengesUseCase: PageChallengesUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ChallengeRepository,
          useClass: InMemoryChallengeRepository,
        },
        CreateChallengeUseCase,
        RemoveChallengeUseCase,
        PageChallengesUseCase,
      ],
    }).compile();

    createChallengeUseCase = moduleRef.get(CreateChallengeUseCase);
    removeChallengeUseCase = moduleRef.get(RemoveChallengeUseCase);
    pageChallengesUseCase = moduleRef.get(PageChallengesUseCase);
  });

  it('should be able to remove Challenges', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    await removeChallengeUseCase.handle({
      id: challenge.id,
    });

    const response = await pageChallengesUseCase.handle({
      filter: {
        title: 'Challenge Example',
      },
      limit: 1,
      offset: 0,
    });

    expect(response.nodes).not.toEqual<Challenge[]>(
      expect.arrayContaining([challenge]),
    );
  });

  it('should not be able to edit a Challenge with an invalid id', async () => {
    const response = removeChallengeUseCase.handle({
      id: 'invalid-id',
    });

    await expect(response).rejects.toThrow(
      new Error('Challenge not found') as UseCaseError,
    );
  });
});
