import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { PrismaChallengeRepository } from '@infra/database/prisma/repositories/prisma-challenge.repository';
import { PrismaSubmissionRepository } from '@infra/database/prisma/repositories/prisma-submission.repository';
import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';
import { SubmissionRepository } from '@infra/database/repositories/submission.repository';
import { MessagingModule } from '@infra/messaging/messaging.module';

import { CreateSubmissionUseCase } from './submissions/create-submission-use-case';

@Module({
  imports: [DatabaseModule, MessagingModule],
  providers: [
    {
      provide: ChallengeRepository,
      useClass: PrismaChallengeRepository,
    },
    {
      provide: SubmissionRepository,
      useClass: PrismaSubmissionRepository,
    },
    CreateSubmissionUseCase,
  ],
  exports: [CreateSubmissionUseCase],
})
export class SubmissionsUseCasesModule {}
