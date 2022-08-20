import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

import { URL } from '../scalers/url.scaler';

enum SubmissonStatus {
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  DONE = 'DONE',
}

registerEnumType(SubmissonStatus, {
  name: 'SubmissonStatus',
  description: 'Available submisson statuses',
});

@ObjectType()
export class Submission {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => ID)
  challengeId: string;

  @Field((_type) => URL)
  repositoryUrl: string;

  @Field((_type) => SubmissonStatus)
  status: SubmissonStatus;

  @Field()
  @Min(0)
  @Max(10)
  grade: number;

  @Field((_type) => Date)
  createdAt: Date;
}
