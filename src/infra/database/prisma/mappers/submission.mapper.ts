import { Challenge, Submission } from '@prisma/client';
import { Maybe } from 'graphql/jsutils/Maybe';

import {
  Submission as SubmissionEntity,
  SubmissionProps,
} from '@domain/entities/Submission';

type Instance = Submission & {
  challenge: Maybe<Challenge>;
};

export class SubmissionMapper {
  static toEntity(instance: Instance): SubmissionEntity {
    const { id } = instance;

    const props = {
      challengeId: instance.challengeId,
      challenge: instance.challenge,
      repositoryUrl: instance.repositoryUrl,
      status: instance.status,
      grade: instance.grade,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    } as SubmissionProps;

    return new SubmissionEntity(props, id);
  }

  static toInstance(entity: SubmissionEntity): Instance {
    return {
      id: entity.id,
      challenge: entity.challenge,
      challengeId: entity.challengeId ?? null,
      repositoryUrl: entity.repositoryUrl,
      status: entity.status,
      grade: entity.grade,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
