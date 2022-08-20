import { Field, ID, InputType } from '@nestjs/graphql';

import { URL } from '../../scalers/url.scaler';

@InputType()
export class CreateSubmissionInput {
  @Field((_type) => ID)
  challengeId: string;

  @Field((_type) => URL)
  repositoryUrl: string;
}
