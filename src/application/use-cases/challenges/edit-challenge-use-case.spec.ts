import { Challenge } from '@domain/entities/challenge';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';
import { EditChallengeUseCase } from './edit-challenge-use-case';

describe('Edit Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let editChallengeUseCase: EditChallengeUseCase;

  beforeEach(() => {
    const challengeRepository = new InMemoryChallengeRepository();
    createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);
    editChallengeUseCase = new EditChallengeUseCase(challengeRepository);
  });

  it('should be able to edit a Challenge', async () => {
    const challenge = await createChallengeUseCase.handle({
      title: 'Challenge Example',
      description: 'Description example',
    });

    const response = await editChallengeUseCase.handle({
      id: challenge.id,
      title: 'New Title',
      description: 'New Description',
    });

    expect(response).not.toBeNull();
    expect(response).toBeInstanceOf(Challenge);

    expect(response.title).toBe('New Title');
    expect(response.description).toBe('New Description');
  });
});
