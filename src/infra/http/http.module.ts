import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { UseCasesModule } from '@application/use-cases.module';

import { ComplexityPlugin } from '@infra/http/graphql/complexity-plugin';
import { ChallengeResolver } from '@infra/http/graphql/resolvers/challenge.resolver';

@Module({
  imports: [
    UseCasesModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      plugins: [new ComplexityPlugin(20)],
    }),
  ],
  providers: [ChallengeResolver],
})
export class HttpModule {}
