import { Injectable } from '@nestjs/common';

import { Challenge } from '@domain/entities/challenge';

import {
  ChallengeRepository,
  ChallengeRequest,
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
}
