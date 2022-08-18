import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Challenge {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => String)
  title: string;

  @Field((_type) => String)
  description: string;

  @Field((_type) => Date)
  createdAt: Date;
}
