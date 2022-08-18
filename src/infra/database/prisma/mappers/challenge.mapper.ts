import { Challenge } from '@prisma/client';

import { Challenge as ChallengeEntity } from '@domain/entities/challenge';

export class ChallengeMapper {
  static toEntity(instance: Challenge): ChallengeEntity {
    const { id } = instance;

    const props = {
      title: instance.title,
      description: instance.description,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    };

    return new ChallengeEntity(props, id);
  }

  static toInstance(entity: ChallengeEntity): Challenge {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
