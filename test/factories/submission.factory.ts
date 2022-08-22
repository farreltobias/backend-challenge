import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { Submission } from '@domain/entities/submission';

import { SubmissionMapper } from '@infra/database/prisma/mappers/submission.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { SubmissionRequest } from '@infra/database/repositories/submission.repository';

type Overrides = Partial<SubmissionRequest>;

export function makeFakeSubmission(data = {} as Overrides) {
  const userName = faker.internet.userName();
  const repoName = faker.git.branch();

  const repositoryUrl = `git@github.com:${userName}/${repoName}.git`;

  const props: SubmissionRequest = {
    challengeId: data.challengeId ?? null,
    repositoryUrl: data.repositoryUrl || repositoryUrl,
    status: data.status || 'PENDING',
    grade: data.grade || 0,
  };

  const submission = Submission.create(props);

  return submission;
}

@Injectable()
export class SubmissionFactory {
  constructor(private prisma: PrismaService) {}

  async makeSubmission(data = {} as Overrides): Promise<Submission> {
    const submission = makeFakeSubmission(data);

    await this.prisma.submission.create({
      data: SubmissionMapper.toInstance(submission),
    });

    return submission;
  }
}
