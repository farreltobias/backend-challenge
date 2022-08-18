import { Injectable } from '@nestjs/common';

import { Challenge } from '@domain/entities/challenge';

import {
  ChallengeRepository,
  ChallengeRequest,
} from '@infra/database/repositories/challenge.repository';

@Injectable()
export class CreateChallengeUseCase {
  constructor(private challengeRepository: ChallengeRepository) {}

  async handle(data: ChallengeRequest): Promise<Challenge> {
    return this.challengeRepository.createChallenge(data);
  }
}
