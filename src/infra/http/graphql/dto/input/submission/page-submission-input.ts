import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';

import { PaginationArgs } from '../../../common/dto/args/pagination-args';
import { SubmissionStatus } from '../../enum/submission-status';

@InputType()
class PageSubmissionFilter {
  @Field(() => Date, { nullable: true })
  fromDate: Date;

  @Field(() => Date, { nullable: true })
  toDate: Date;

  @Field(() => ID, { nullable: true })
  challengeId: string;

  @Field(() => SubmissionStatus, { nullable: true })
  status: SubmissionStatus;
}

@ArgsType()
export class PageSubmissionInput extends PaginationArgs {
  @Field(() => PageSubmissionFilter, { nullable: true })
  filter: PageSubmissionFilter;
}
