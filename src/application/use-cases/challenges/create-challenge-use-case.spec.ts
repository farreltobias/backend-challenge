import { Challenge } from '@domain/entities/challenge';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';

describe('Create Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;

  beforeEach(() => {
    const challengeRepository = new InMemoryChallengeRepository();
    createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);
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
