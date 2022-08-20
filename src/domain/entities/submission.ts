import { Entity } from '@core/domain/Entity';

import { SubmissionRequest } from '@infra/database/repositories/submission.repository';

export type SubmissionStatus = 'PENDING' | 'ERROR' | 'DONE';

export interface SubmissionProps {
  challengeId: string;
  repositoryUrl: string;
  status: SubmissionStatus;
  grade: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Submission extends Entity<SubmissionProps> {
  static create(props: SubmissionRequest) {
    const now = new Date();

    return new Submission({ ...props, createdAt: now, updatedAt: now });
  }

  get challengeId() {
    return this.props.challengeId;
  }

  get repositoryUrl() {
    return this.props.repositoryUrl;
  }

  get status() {
    return this.props.status;
  }

  get grade() {
    return this.props.grade;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
