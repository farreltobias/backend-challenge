import { Challenge } from '@domain/entities/challenge';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';
import { PageChallengesUseCase } from './page-challenges-use-case';
import { RemoveChallengeUseCase } from './remove-challenge-use-case';

describe('Remove Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let removeChallengeUseCase: RemoveChallengeUseCase;
  let pageChallengesUseCase: PageChallengesUseCase;

  beforeEach(() => {
    const challengeRepository = new InMemoryChallengeRepository();
    createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);
    removeChallengeUseCase = new RemoveChallengeUseCase(challengeRepository);
    pageChallengesUseCase = new PageChallengesUseCase(challengeRepository);
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
});
