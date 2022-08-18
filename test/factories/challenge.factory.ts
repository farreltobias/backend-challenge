import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { Challenge } from '@domain/entities/challenge';

import { ChallengeMapper } from '@infra/database/prisma/mappers/challenge.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { ChallengeRequest } from '@infra/database/repositories/challenge.repository';

type Overrides = Partial<ChallengeRequest>;

export function makeFakeChallenge(data = {} as Overrides) {
  const title = faker.commerce.productName();
  const description = faker.commerce.productDescription();

  const props = {
    title: data.title || title,
    description: data.description || description,
  };

  const challenge = Challenge.create(props);

  return challenge;
}

@Injectable()
export class ChallengeFactory {
  constructor(private prisma: PrismaService) {}

  async makeChallenge(data = {} as Overrides): Promise<Challenge> {
    const challenge = makeFakeChallenge(data);

    await this.prisma.challenge.create({
      data: ChallengeMapper.toInstance(challenge),
    });

    return challenge;
  }
}
