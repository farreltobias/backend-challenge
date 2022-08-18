import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { PrismaChallengeRepository } from '@infra/database/prisma/repositories/prisma-challenge.repository';
import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';

import { CreateChallengeUseCase } from './use-cases/challenges/create-challenge-use-case';
import { EditChallengeUseCase } from './use-cases/challenges/edit-challenge-use-case';
import { PageChallengesUseCase } from './use-cases/challenges/page-challenges-use-case';
import { RemoveChallengeUseCase } from './use-cases/challenges/remove-challenge-use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ChallengeRepository,
      useClass: PrismaChallengeRepository,
    },
    CreateChallengeUseCase,
    EditChallengeUseCase,
    RemoveChallengeUseCase,
    PageChallengesUseCase,
  ],
  exports: [
    CreateChallengeUseCase,
    EditChallengeUseCase,
    RemoveChallengeUseCase,
    PageChallengesUseCase,
  ],
})
export class UseCasesModule {}
