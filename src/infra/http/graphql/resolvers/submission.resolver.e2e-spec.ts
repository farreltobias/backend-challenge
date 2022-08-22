import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@infra/http/http.module';
import { KafkaService } from '@infra/messaging/kafka.service';

import { ChallengeFactory } from '@test/factories/challenge.factory';
import {
  SubmissionFactory,
  makeFakeSubmission,
} from '@test/factories/submission.factory';

import { Submission } from '../dto/models/submission';
import { ChallengeViewModel } from '../view-models/challenge.view-model';
import { SubmissionViewModel } from '../view-models/submission.view-model';

describe('Submission Resolver (e2e)', () => {
  let app: INestApplication;

  let submissionFactory: SubmissionFactory;
  let challengeFactory: ChallengeFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, HttpModule],
      providers: [SubmissionFactory, ChallengeFactory],
    })
      .overrideProvider(KafkaService)
      .useValue({
        send: jest.fn(() => ({
          subscribe: jest.fn(),
        })),
      })
      .compile();

    app = moduleRef.createNestApplication();

    submissionFactory = moduleRef.get<SubmissionFactory>(SubmissionFactory);
    challengeFactory = moduleRef.get<ChallengeFactory>(ChallengeFactory);

    await app.init();
  });

  it('(Mutation) CreateSubmission', async () => {
    const challenge = await challengeFactory.makeChallenge();

    const submission = makeFakeSubmission({ challenge });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createSubmission(data: {
              challengeId: "${submission.challengeId}"
              repositoryUrl: "${submission.repositoryUrl}"
            }){
              id
              repositoryUrl
              status
              grade
              createdAt
              challenge {
                id
                title
                description
                createdAt
              }
            }
          }
        `,
      })
      .expect(200);

    const graphqlSubmission = SubmissionViewModel.toGraphql(submission);

    expect(response.body.data.createSubmission).toEqual({
      grade: graphqlSubmission.grade,
      status: graphqlSubmission.status,
      repositoryUrl: graphqlSubmission.repositoryUrl,
      challenge: {
        ...graphqlSubmission.challenge,
        createdAt: expect.any(String),
      },
      id: expect.any(String),
      createdAt: expect.any(String),
    } as Submission);
  });

  it('(Query) SubmissionPager', async () => {
    const challenge = await challengeFactory.makeChallenge();

    const submission = await submissionFactory.makeSubmission({
      challenge,
    });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            submissions (
              offset: 0
              limit: 1
              filter: {
                challengeId: "${submission.challengeId}"
                status: ${submission.status}
              }
            ) {
              nodes {
                id
                repositoryUrl
                status
                grade
                createdAt
                challenge {
                  id
                  title
                  description
                  createdAt
                }
              }
              totalCount
            }
          }
        `,
      })
      .expect(200);

    const graphqlSubmission = {
      ...SubmissionViewModel.toGraphql(submission),
      challenge: {
        ...ChallengeViewModel.toGraphql(challenge),
        id: expect.any(String),
        createdAt: expect.any(String),
      },
      id: expect.any(String),
      createdAt: expect.any(String),
    };

    expect(response.body.data.submissions.nodes?.[0]).toEqual(
      graphqlSubmission,
    );
  });
});
