import { Module } from '@nestjs/common';

import { ChallengesUseCasesModule } from './challenges-use-cases.module';
import { SubmissionsUseCasesModule } from './submissions-use-cases.module';

@Module({
  imports: [ChallengesUseCasesModule, SubmissionsUseCasesModule],
  exports: [ChallengesUseCasesModule, SubmissionsUseCasesModule],
})
export class UseCasesModule {}
