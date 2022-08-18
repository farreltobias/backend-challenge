import { Challenge } from '@domain/entities/challenge';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';
import { PageChallengesUseCase } from './page-challenges-use-case';

describe('Page Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let pageChallengesUseCase: PageChallengesUseCase;

  beforeEach(() => {
    const challengeRepository = new InMemoryChallengeRepository();
    createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);
    pageChallengesUseCase = new PageChallengesUseCase(challengeRepository);
  });

  it('should be able to page Challenges', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const response = await pageChallengesUseCase.handle({
      filter: {
        title: 'Challenge Example',
      },
      limit: 1,
      offset: 0,
    });

    expect(response.nodes).not.toBeNull();
    expect(response.nodes?.[0]).toBeInstanceOf(Challenge);

    expect(response.totalCount).toBe(1);
    expect(response.nodes).toEqual<Challenge[]>([challenge]);
  });

  it('should be able to filter Challenges in pager', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const challengeNotIncluded = await createChallengeUseCase.handle({
      title: 'Challenge Not Included',
      description: 'Description example',
    });

    const response = await pageChallengesUseCase.handle({
      filter: {
        title: 'Challenge Example',
      },
      limit: 2,
      offset: 0,
    });

    expect(response.nodes).not.toBeNull();

    expect(response.totalCount).toBe(1);
    expect(response.nodes).toEqual<Challenge[]>(
      expect.arrayContaining([challenge]),
    );

    expect(response.nodes).not.toEqual<Challenge[]>(
      expect.arrayContaining([challengeNotIncluded]),
    );
  });
});
