import { Injectable } from '@nestjs/common';

import { Challenge, ChallengeProps } from '@domain/entities/challenge';

// createdAt and updatedAt are generated automatically
export type ChallengeRequest = Omit<ChallengeProps, 'createdAt' | 'updatedAt'>;

@Injectable()
export abstract class ChallengeRepository {
  abstract createChallenge(challenge: ChallengeRequest): Promise<Challenge>;
}
