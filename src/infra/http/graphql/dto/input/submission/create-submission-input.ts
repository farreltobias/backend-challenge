import { Field, ID, InputType } from '@nestjs/graphql';

import { URL } from '../../scalars/url';

@InputType()
export class CreateSubmissionInput {
  @Field(() => ID)
  challengeId: string;

  @Field(() => URL)
  repositoryUrl: string;
}
