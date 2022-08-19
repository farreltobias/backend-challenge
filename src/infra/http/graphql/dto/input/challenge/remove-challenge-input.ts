import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveChallengeInput {
  @Field(() => ID)
  id: string;
}
