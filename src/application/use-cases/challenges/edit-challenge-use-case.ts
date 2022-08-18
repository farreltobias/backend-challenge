import { Injectable } from '@nestjs/common';

import { UseCaseError } from '@application/errors/use-case-error';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

type EditChallengeRequest = {
  id: string;
  title?: string;
  description?: string;
};

type EditChallengeResponse = Challenge;

@Injectable()
export class EditChallengeUseCase {
  constructor(private challengeRepository: ChallengeRepository) {}

  async handle({
    id,
    title,
    description,
  }: EditChallengeRequest): Promise<EditChallengeResponse> {
    const foundChallenge = await this.challengeRepository.getChallengeById(id);

    if (!foundChallenge) {
      throw new Error('Challenge not found') as UseCaseError;
    }

    return this.challengeRepository.updateChallenge({
      id,
      title,
      description,
    });
  }
}
