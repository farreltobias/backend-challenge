import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UseCaseError } from '@application/errors/use-case-error';
import { CreateSubmissionUseCase } from '@application/use-cases/submissions/create-submission-use-case';
import { PageSubmissionsUseCase } from '@application/use-cases/submissions/page-submission-use-case';

import { CreateSubmissionInput } from '../dto/input/submission/create-submission-input';
import { PageSubmissionInput } from '../dto/input/submission/page-submission-input';
import { Submission } from '../dto/models/submission';
import { SubmissionPager } from '../dto/output/submission/page-submissions-output';
import { SubmissionViewModel } from '../view-models/submission.view-model';
import { UseCaseErrorViewModel } from '../view-models/use-case-error.view-model';

@Resolver(() => String)
export class SubmissionResolver {
  constructor(
    private createSubmissionUseCase: CreateSubmissionUseCase,
    private pageSubmissionUseCase: PageSubmissionsUseCase,
  ) {}

  @Mutation((_returns) => Submission)
  async createSubmission(@Args('data') data: CreateSubmissionInput) {
    try {
      return this.createSubmissionUseCase.handle(data);
    } catch (error) {
      if (error instanceof UseCaseError) {
        throw UseCaseErrorViewModel.toGraphQL(error);
      }
    }
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
