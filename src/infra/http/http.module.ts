import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { UseCasesModule } from '@application/use-cases/use-cases.module';

import { ComplexityPlugin } from '@infra/http/graphql/complexity-plugin';
import { URL } from '@infra/http/graphql/dto/scalars/url';
import { ChallengeResolver } from '@infra/http/graphql/resolvers/challenge.resolver';
import { SubmissionResolver } from '@infra/http/graphql/resolvers/submission.resolver';

@Module({
  imports: [
    UseCasesModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      plugins: [new ComplexityPlugin(20)],
      resolvers: {
        URL,
      },
    }),
  ],
  providers: [ChallengeResolver, SubmissionResolver],
})
export class HttpModule {}
