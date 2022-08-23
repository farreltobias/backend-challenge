import { Injectable } from '@nestjs/common';
import { Maybe } from 'graphql/jsutils/Maybe';

import { AsyncMaybe } from '@core/logic/Maybe';

import {
  Submission,
  SubmissionProps,
  SubmissionStatus,
} from '@domain/entities/submission';

// createdAt and updatedAt are generated automatically
export type SubmissionRequest = Omit<
  SubmissionProps,
  'createdAt' | 'updatedAt'
>;

export type CreateSubmissions = {
  challengeId: Maybe<string>;
  repositoryUrl: string;
  status?: SubmissionStatus;
};

export type FilterSubmissions = {
  fromDate?: Date;
  toDate?: Date;
  challengeId?: string;
  status?: SubmissionStatus;
};

export type UpdateSubmissionRequest = {
  id: string;
} & Partial<Omit<SubmissionRequest, 'challenge'>>;

export type PageSubmissions = {
  filter: FilterSubmissions;
  offset: number;
  limit: number;
};

@Injectable()
export abstract class SubmissionRepository {
  abstract countSubmissions(filter: FilterSubmissions): Promise<number>;
  abstract pageSubmissions(filter: PageSubmissions): AsyncMaybe<Submission[]>;

  abstract createSubmission(Submission: CreateSubmissions): Promise<Submission>;
  abstract updateSubmission(
    submission: UpdateSubmissionRequest,
  ): Promise<Submission>;

  abstract getSubmissionById(id: string): AsyncMaybe<Submission>;
}
