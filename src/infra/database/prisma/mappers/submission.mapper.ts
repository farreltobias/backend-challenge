import { Submission } from '@prisma/client';

import {
  Submission as SubmissionEntity,
  SubmissionProps,
} from '@domain/entities/Submission';

export class SubmissionMapper {
  static toEntity(instance: Submission): SubmissionEntity {
    const { id } = instance;

    const props = {
      challengeId: instance.challengeId,
      repositoryUrl: instance.repositoryUrl,
      status: instance.status,
      grade: instance.grade,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    } as SubmissionProps;

    return new SubmissionEntity(props, id);
  }

  static toInstance(entity: SubmissionEntity): Submission {
    return {
      id: entity.id,
      challengeId: entity.challengeId,
      repositoryUrl: entity.repositoryUrl,
      status: entity.status,
      grade: entity.grade,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
