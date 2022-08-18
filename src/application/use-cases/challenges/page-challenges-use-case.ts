import { Injectable } from '@nestjs/common';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';
import { PaginatedType } from '@infra/http/graphql/common/dto/models/paginated';

type PageChallengesRequest = {
  filter: {
    title?: string;
    description?: string;
  };
  limit: number;
  offset: number;
};

type PageChallengesResponse = PaginatedType<Challenge>;

@Injectable()
export class PageChallengesUseCase {
  constructor(private challengeRepository: ChallengeRepository) {}

  async handle({
    filter = {},
    limit,
    offset,
  }: PageChallengesRequest): Promise<PageChallengesResponse> {
    const challenges = await this.challengeRepository.pageChallenges({
      filter,
      limit,
      offset,
    });

    const totalCount = await this.challengeRepository.countChallenges(filter);

    return {
      nodes: challenges,
      totalCount,
    };
  }
}
