import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { PaginationArgs } from '../../../common/dto/args/pagination-args';

@InputType()
class PageChallengeFilter {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;
}

@ArgsType()
export class PageChallengeInput extends PaginationArgs {
  @Field(() => PageChallengeFilter, { nullable: true })
  filter: PageChallengeFilter;
}
