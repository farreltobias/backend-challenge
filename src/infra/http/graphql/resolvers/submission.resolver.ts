import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateSubmissionUseCase } from '@application/use-cases/submissions/create-submission-use-case';
import { PageSubmissionsUseCase } from '@application/use-cases/submissions/page-submissions-use-case';

import { CreateSubmissionInput } from '../dto/input/submission/create-submission-input';
import { PageSubmissionInput } from '../dto/input/submission/page-submission-input';
import { Submission } from '../dto/models/submission';
import { SubmissionPager } from '../dto/output/submission/page-submissions-output';
import { SubmissionViewModel } from '../view-models/submission.view-model';

@Resolver(() => String)
export class SubmissionResolver {
  constructor(
    private createSubmissionUseCase: CreateSubmissionUseCase,
    private pageSubmissionUseCase: PageSubmissionsUseCase,
  ) {}

  @Mutation((_returns) => Submission)
  async createSubmission(@Args('data') data: CreateSubmissionInput) {
    return this.createSubmissionUseCase.handle(data);
  }

  @Query((_returns) => SubmissionPager)
  async submissions(@Args() { filter, offset, limit }: PageSubmissionInput) {
    const result = await this.pageSubmissionUseCase.handle({
      filter,
      offset,
      limit,
    });

    return {
      ...result,
      nodes: result.nodes
        ? result.nodes.map(SubmissionViewModel.toGraphql)
        : null,
    };
  }
}
