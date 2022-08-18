import { Injectable } from '@nestjs/common';
import { Challenge } from '@prisma/client';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Challenge as ChallengeEntity } from '@domain/entities/challenge';

import { ChallengeMapper } from '@infra/database/prisma/mappers/challenge.mapper';
import {
  ChallengeRepository,
  ChallengeRequest,
  FilterChallenges,
  PageChallenges,
  UpdateChallengeRequest,
} from '@infra/database/repositories/challenge.repository';

@Injectable()
export class InMemoryChallengeRepository implements ChallengeRepository {
  private items: Challenge[] = [];

  private filterItemsByTitleAndDescription(title = '', description = '') {
    return this.items.filter((challenge) => {
      return (
        challenge.title.toLowerCase().includes(title.toLowerCase()) &&
        challenge.description.toLowerCase().includes(description.toLowerCase())
      );
    });
  }

  async pageChallenges({
    filter,
    limit,
    offset,
  }: PageChallenges): AsyncMaybe<ChallengeEntity[]> {
    const { title, description } = filter;

    const challenges = this.filterItemsByTitleAndDescription(
      title,
      description,
    ).slice(offset, offset + limit);

    if (!challenges.length) return null;

    return challenges.map(ChallengeMapper.toEntity);
  }

  async countChallenges(filter: FilterChallenges): Promise<number> {
    const { title, description } = filter;

    return this.filterItemsByTitleAndDescription(title, description).length;
  }

  async getChallengeById(id: string) {
    const challenge = this.items.find((challenge) => challenge.id === id);

    if (!challenge) return null;

    return ChallengeMapper.toEntity(challenge);
  }

  async createChallenge(challenge: ChallengeRequest): Promise<ChallengeEntity> {
    const entity = new ChallengeEntity({
      title: challenge.title,
      description: challenge.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const instance = ChallengeMapper.toInstance(entity);

    this.items.push(instance);

    return entity;
  }

  async updateChallenge(
    challenge: UpdateChallengeRequest,
  ): Promise<ChallengeEntity> {
    const index = this.items.findIndex((item) => item.id === challenge.id);

    const instance = this.items[index];

    this.items[index] = {
      ...instance,
      title: challenge.title || instance.title,
      description: challenge.description || instance.description,
      updatedAt: new Date(),
    };

    return ChallengeMapper.toEntity(this.items[index]);
  }

  async deleteChallenge(id: string): Promise<ChallengeEntity> {
    const index = this.items.findIndex((item) => item.id === id);

    const challenge = this.items[index];

    this.items.splice(index, 1);

    return ChallengeMapper.toEntity(challenge);
  }
}
