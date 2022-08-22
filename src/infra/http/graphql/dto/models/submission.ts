import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

import { SubmissionStatus } from '../enum/submission-status';
import { URL } from '../scalars/url';
import { Challenge } from './challenge';

@ObjectType()
export class Submission {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => Challenge, { nullable: true })
  challenge: Challenge | null;

  challengeId?: string;

  @Field((_type) => URL)
  repositoryUrl: string;

  @Field((_type) => SubmissionStatus)
  status: SubmissionStatus;

  @Field()
  @Min(0)
  @Max(10)
  grade: number;

  @Field((_type) => Date)
  createdAt: Date;
}
