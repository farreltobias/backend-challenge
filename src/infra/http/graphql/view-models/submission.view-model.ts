import { Submission as SubmissionEntity } from '@domain/entities/submission';

import { SubmissionStatus } from '../dto/enum/submission-status';
import { Submission } from '../dto/models/submission';

export class SubmissionViewModel {
  static toGraphql(submission: SubmissionEntity): Submission {
    return {
      id: submission.id,
      challengeId: submission.challengeId,
      repositoryUrl: submission.repositoryUrl,
      status: SubmissionStatus[submission.status],
      grade: submission.grade,
      createdAt: submission.createdAt,
    };
  }
}
