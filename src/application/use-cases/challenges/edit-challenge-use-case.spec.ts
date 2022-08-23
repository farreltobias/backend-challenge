import { Test } from '@nestjs/testing';

import { UseCaseError } from '@application/errors/use-case-error';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

import { InMemoryChallengeRepository } from '@test/repositories/in-memory-challenge.repository';

import { CreateChallengeUseCase } from './create-challenge-use-case';
import { EditChallengeUseCase } from './edit-challenge-use-case';

describe('Edit Challenge UseCase', () => {
  let createChallengeUseCase: CreateChallengeUseCase;
  let editChallengeUseCase: EditChallengeUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ChallengeRepository,
          useClass: InMemoryChallengeRepository,
        },
        CreateChallengeUseCase,
        EditChallengeUseCase,
      ],
    }).compile();

    createChallengeUseCase = moduleRef.get(CreateChallengeUseCase);
    editChallengeUseCase = moduleRef.get(EditChallengeUseCase);
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

  it('should not be able to edit a Challenge with an invalid id', async () => {
    const response = editChallengeUseCase.handle({
      id: 'invalid-id',
      title: 'New Title',
      description: 'New Description',
    });

    await expect(response).rejects.toThrow(
      new Error('Challenge not found') as UseCaseError,
    );
  });
});
