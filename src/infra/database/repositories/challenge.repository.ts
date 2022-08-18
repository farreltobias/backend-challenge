import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Challenge, ChallengeProps } from '@domain/entities/challenge';

// createdAt and updatedAt are generated automatically
export type ChallengeRequest = Omit<ChallengeProps, 'createdAt' | 'updatedAt'>;

export type FilterChallenges = Partial<ChallengeRequest>;

export type UpdateChallengeRequest = {
  id: string;
} & FilterChallenges;

@Injectable()
export abstract class ChallengeRepository {
  abstract createChallenge(challenge: ChallengeRequest): Promise<Challenge>;
  abstract updateChallenge(
    challenge: UpdateChallengeRequest,
  ): Promise<Challenge>;

  abstract deleteChallenge(id: string): Promise<Challenge>;
  abstract getChallengeById(id: string): AsyncMaybe<Challenge>;
}
