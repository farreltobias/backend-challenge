import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateChallengeUseCase } from '@application/use-cases/challenges/create-challenge-use-case';

import { CreateChallengeInput } from '../dto/input/create-challenge-input';
import { Challenge } from '../dto/models/challenge';
import { ChallengeViewModel } from '../view-models/challenge.view-model';

@Resolver(() => String)
export class ChallengeResolver {
  constructor(private createChallengeUseCase: CreateChallengeUseCase) {}

  @Mutation((_returns) => Challenge)
  async createChallenge(@Args('data') data: CreateChallengeInput) {
    const entity = await this.createChallengeUseCase.handle(data);

    return ChallengeViewModel.toGraphql(entity);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
