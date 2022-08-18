import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChallengeInput {
  @Field()
  title: string;

  @Field()
  description: string;
}
