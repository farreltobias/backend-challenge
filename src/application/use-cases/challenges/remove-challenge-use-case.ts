import { Injectable } from '@nestjs/common';

import { UseCaseError } from '@application/errors/use-case-error';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

type RemoveChallengeRequest = {
  id: string;
};

type RemoveChallengeResponse = Challenge;

@Injectable()
export class RemoveChallengeUseCase {
  constructor(private challengeRepository: ChallengeRepository) {}

  async handle({
    id,
  }: RemoveChallengeRequest): Promise<RemoveChallengeResponse> {
    const foundChallenge = await this.challengeRepository.getChallengeById(id);

    if (!foundChallenge) {
      throw new Error('Challenge not found') as UseCaseError;
    }

    return this.challengeRepository.deleteChallenge(id);
  }
}
