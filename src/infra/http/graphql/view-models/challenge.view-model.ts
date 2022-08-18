import { Challenge as ChallengeEntity } from '@domain/entities/challenge';

import { Challenge } from '../dto/models/challenge';

export class ChallengeViewModel {
  static toGraphql(challenge: ChallengeEntity): Challenge {
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      createdAt: challenge.createdAt,
    };
  }
}
