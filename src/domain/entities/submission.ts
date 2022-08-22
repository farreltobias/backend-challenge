import { Entity } from '@core/domain/Entity';

import { SubmissionRequest } from '@infra/database/repositories/submission.repository';

import { Challenge } from './challenge';

export type SubmissionStatus = 'PENDING' | 'ERROR' | 'DONE';

export interface SubmissionProps {
  challengeId: string | null;
  challenge: Challenge | null;
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

  get challenge() {
    return this.props.challenge;
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
