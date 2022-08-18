import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateChallengeUseCase } from '@application/use-cases/challenges/create-challenge-use-case';
import { EditChallengeUseCase } from '@application/use-cases/challenges/edit-challenge-use-case';
import { RemoveChallengeUseCase } from '@application/use-cases/challenges/remove-challenge-use-case';

import { CreateChallengeInput } from '../dto/input/create-challenge-input';
import { EditChallengeInput } from '../dto/input/edit-challenge-input';
import { RemoveChallengeInput } from '../dto/input/remove-challenge-input';
import { Challenge } from '../dto/models/challenge';
import { ChallengeViewModel } from '../view-models/challenge.view-model';

@Resolver(() => String)
export class ChallengeResolver {
  constructor(
    private createChallengeUseCase: CreateChallengeUseCase,
    private editChallengeUseCase: EditChallengeUseCase,
    private removeChallengeUseCase: RemoveChallengeUseCase,
  ) {}

  @Mutation((_returns) => Challenge)
  async createChallenge(@Args('data') data: CreateChallengeInput) {
    const entity = await this.createChallengeUseCase.handle(data);

    return ChallengeViewModel.toGraphql(entity);
  }

  @Mutation((_returns) => Challenge)
  async editChallenge(@Args('data') data: EditChallengeInput) {
    const entity = await this.editChallengeUseCase.handle(data);

    return ChallengeViewModel.toGraphql(entity);
  }

  @Mutation((_returns) => Challenge)
  async removeChallenge(@Args('data') data: RemoveChallengeInput) {
    const entity = await this.removeChallengeUseCase.handle(data);

    return ChallengeViewModel.toGraphql(entity);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
