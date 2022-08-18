import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Challenge, ChallengeProps } from '@domain/entities/challenge';

// createdAt and updatedAt are generated automatically
export type ChallengeRequest = Omit<ChallengeProps, 'createdAt' | 'updatedAt'>;

export type FilterChallenges = Partial<ChallengeRequest>;

export type UpdateChallengeRequest = {
  id: string;
} & FilterChallenges;

export type PageChallenges = {
  filter: FilterChallenges;
  offset: number;
  limit: number;
};

@Injectable()
export abstract class ChallengeRepository {
  abstract countChallenges(filter: FilterChallenges): Promise<number>;
  abstract pageChallenges(filter: PageChallenges): AsyncMaybe<Challenge[]>;

  abstract createChallenge(challenge: ChallengeRequest): Promise<Challenge>;
  abstract updateChallenge(
    challenge: UpdateChallengeRequest,
  ): Promise<Challenge>;

  abstract deleteChallenge(id: string): Promise<Challenge>;
  abstract getChallengeById(id: string): AsyncMaybe<Challenge>;
}
