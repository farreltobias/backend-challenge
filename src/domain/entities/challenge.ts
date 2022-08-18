import { Entity } from '@core/domain/Entity';

import { ChallengeRequest } from '@infra/database/repositories/challenge.repository';

export interface ChallengeProps {
  title: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}

export class Challenge extends Entity<ChallengeProps> {
  static create(props: ChallengeRequest) {
    const now = new Date();

    return new Challenge({ ...props, createdAt: now, updatedAt: now });
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
