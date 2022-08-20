import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UseCaseError } from '@application/errors/use-case-error';
import { CreateSubmissionUseCase } from '@application/use-cases/submissions/create-submission-use-case';

import { CreateSubmissionInput } from '../dto/input/submission/create-submission-input';
import { Submission } from '../dto/models/submission';
import { UseCaseErrorViewModel } from '../view-models/use-case-error.view-model';

@Resolver(() => String)
export class SubmissionResolver {
  constructor(private createSubmissionUseCase: CreateSubmissionUseCase) {}

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

  @Query((_returns) => [Submission])
  async submissions() {
    return [] as Submission[];
  }
}
