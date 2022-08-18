import { Injectable } from '@nestjs/common';

import { Challenge } from '@domain/entities/challenge';

import {
  ChallengeRepository,
  ChallengeRequest,
  UpdateChallengeRequest,
} from '@infra/database/repositories/challenge.repository';

import { ChallengeMapper } from '../mappers/challenge.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaChallengeRepository implements ChallengeRepository {
  constructor(private prisma: PrismaService) {}

  async createChallenge(challenge: ChallengeRequest): Promise<Challenge> {
    const instance = await this.prisma.challenge.create({
      data: challenge,
    });

    return ChallengeMapper.toEntity(instance);
  }

  async getChallengeById(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: {
        id,
      },
    });

    if (!challenge) return null;

    return ChallengeMapper.toEntity(challenge);
  }

  async updateChallenge(challenge: UpdateChallengeRequest): Promise<Challenge> {
    const instance = await this.prisma.challenge.update({
      where: {
        id: challenge.id,
      },
      data: challenge,
    });

    return ChallengeMapper.toEntity(instance);
  }

  async deleteChallenge(id: string): Promise<Challenge> {
    const challenge = await this.prisma.challenge.delete({
      where: {
        id,
      },
    });

    return ChallengeMapper.toEntity(challenge);
  }
}
