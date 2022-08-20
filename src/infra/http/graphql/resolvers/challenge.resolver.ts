import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateChallengeUseCase } from '@application/use-cases/challenges/create-challenge-use-case';
import { EditChallengeUseCase } from '@application/use-cases/challenges/edit-challenge-use-case';
import { PageChallengesUseCase } from '@application/use-cases/challenges/page-challenges-use-case';
import { RemoveChallengeUseCase } from '@application/use-cases/challenges/remove-challenge-use-case';

import { CreateChallengeInput } from '../dto/input/challenge/create-challenge-input';
import { EditChallengeInput } from '../dto/input/challenge/edit-challenge-input';
import { PageChallengeInput } from '../dto/input/challenge/page-challenges-input';
import { RemoveChallengeInput } from '../dto/input/challenge/remove-challenge-input';
import { Challenge } from '../dto/models/challenge';
import { ChallengePager } from '../dto/output/challenges/page-challenges-output';
import { ChallengeViewModel } from '../view-models/challenge.view-model';

@Resolver(() => String)
export class ChallengeResolver {
  constructor(
    private createChallengeUseCase: CreateChallengeUseCase,
    private editChallengeUseCase: EditChallengeUseCase,
    private removeChallengeUseCase: RemoveChallengeUseCase,
    private pageChallengeUseCase: PageChallengesUseCase,
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

  @Query((_returns) => ChallengePager)
  async challenges(@Args() { filter, offset, limit }: PageChallengeInput) {
    const result = await this.pageChallengeUseCase.handle({
      filter,
      offset,
      limit,
    });

    return {
      ...result,
      nodes: result.nodes
        ? result.nodes.map(ChallengeViewModel.toGraphql)
        : null,
    };
  }
}
