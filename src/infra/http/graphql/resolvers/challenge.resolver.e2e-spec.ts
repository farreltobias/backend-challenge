import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@infra/http/http.module';
import { KafkaService } from '@infra/messaging/kafka.service';

import {
  ChallengeFactory,
  makeFakeChallenge,
} from '@test/factories/challenge.factory';

import { ChallengeViewModel } from '../view-models/challenge.view-model';

describe('Challenge Resolver (e2e)', () => {
  let app: INestApplication;

  let challengeFactory: ChallengeFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      providers: [ChallengeFactory],
    })
      .overrideProvider(KafkaService)
      .useValue({
        send: jest.fn(() => ({
          subscribe: jest.fn(),
        })),
      })
      .compile();

    app = moduleRef.createNestApplication();

    challengeFactory = moduleRef.get<ChallengeFactory>(ChallengeFactory);

    await app.init();
  });

  it('(Mutation) CreateChallenge', async () => {
    const challenge = makeFakeChallenge();

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createChallenge(data: {
              title: "${challenge.title}"
              description: "${challenge.description}"
            }) {
              id
              title
              description
              createdAt
            }
          }
        `,
      })
      .expect(200);

    const graphqlChallenge = ChallengeViewModel.toGraphql(challenge);

    expect(response.body.data.createChallenge).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: graphqlChallenge.title,
        description: graphqlChallenge.description,
        createdAt: expect.any(String),
      }),
    );
  });

  it('(Mutation) EditChallenge', async () => {
    const title = 'New Title';
    const description = 'New Description';

    const challenge = await challengeFactory.makeChallenge();

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            editChallenge(data: {
              id: "${challenge.id}"
              title: "${title}"
              description: "${description}"
            }) {
              id
              title
              description
              createdAt
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.editChallenge).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title,
        description,
        createdAt: expect.any(String),
      }),
    );
  });

  it('(Mutation) RemoveChallenge', async () => {
    const challenge = await challengeFactory.makeChallenge();

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            removeChallenge(data: {
              id: "${challenge.id}"
            }) {
              id
              title
              description
              createdAt
            }
          }
        `,
      })
      .expect(200);

    const queryResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            challenges(filter: {
              title: "${challenge.title}"
            }) {
              totalCount
            }
          }
        `,
      })
      .expect(200);

    const graphqlChallenge = {
      ...ChallengeViewModel.toGraphql(challenge),
      createdAt: challenge.createdAt.toISOString(),
    };

    expect(response.body.data.removeChallenge).toEqual(graphqlChallenge);
    expect(queryResponse.body.data.challenges.totalCount).toBe(0);
  });

  it('(Query) ChallengePager', async () => {
    const challenge = await challengeFactory.makeChallenge();

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            challenges(
              offset: 0
              limit: 1
              filter: {
                title: "${challenge.title}",
                description: "${challenge.description}"
              }
            ) {
              nodes {
                id
                title
                description
                createdAt
              }
              totalCount
            }
          }
        `,
      })
      .expect(200);

    const graphqlChallenge = {
      ...ChallengeViewModel.toGraphql(challenge),
      createdAt: challenge.createdAt.toISOString(),
    };

    expect(response.body.data.challenges.nodes).toEqual(
      expect.arrayContaining([graphqlChallenge]),
    );
  });
});
