import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { PrismaChallengeRepository } from '@infra/database/prisma/repositories/prisma-challenge.repository';
import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

import { CreateChallengeUseCase } from './use-cases/challenges/create-challenge-use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ChallengeRepository,
      useClass: PrismaChallengeRepository,
    },
    CreateChallengeUseCase,
  ],
  exports: [CreateChallengeUseCase],
})
export class UseCasesModule {}
