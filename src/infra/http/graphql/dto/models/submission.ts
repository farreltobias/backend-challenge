import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

import { SubmissionStatus } from '../enum/submission-status';
import { URL } from '../scalars/url';

@ObjectType()
export class Submission {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => ID, { nullable: true })
  challengeId: string | null;

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
