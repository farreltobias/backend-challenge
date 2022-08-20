import { Injectable } from '@nestjs/common';

import { UseCaseError } from '@application/errors/use-case-error';

import { Submission } from '@domain/entities/submission';

import { ChallengeRepository } from '@infra/database/repositories/challenge.repository';
import {
  SubmissionRepository,
  SubmissionRequest,
} from '@infra/database/repositories/submission.repository';
import { KafkaService } from '@infra/messaging/kafka.service';

interface CorrectLessonMessage {
  submissionId: string;
  repositoryUrl: string;
}

interface CorrectLessonResponse {
  submissionId: string;
  repositoryUrl: string;
  grade: number;
  status: 'PENDING' | 'ERROR' | 'DONE';
}

type CreateChallengeRequest = Omit<SubmissionRequest, 'status' | 'grade'>;

@Injectable()
export class CreateSubmissionUseCase {
  constructor(
    private challengeRepository: ChallengeRepository,
    private submissionRepository: SubmissionRepository,
    private kafka: KafkaService,
  ) {}

  async handle(data: CreateChallengeRequest): Promise<Submission> {
    const challenge = await this.challengeRepository.getChallengeById(
      data.challengeId,
    );

    if (!challenge) {
      await this.submissionRepository.createSubmission({
        ...data,
        status: 'ERROR',
      });

      throw new Error('Challenge not found') as UseCaseError;
    }

    if (!this.checkIfURLIsAValidGitHubRepository(data.repositoryUrl)) {
      await this.submissionRepository.createSubmission({
        ...data,
        status: 'ERROR',
      });

      throw new Error('Url is not a valid GitHub repository') as UseCaseError;
    }

    const submission = await this.submissionRepository.createSubmission(data);

    const observable = this.kafka.send<
      CorrectLessonResponse,
      CorrectLessonMessage
    >('challenge.correction', {
      submissionId: submission.id,
      repositoryUrl: submission.repositoryUrl,
    });

    observable.subscribe((response) =>
      this.submissionRepository.updateSubmission({
        id: submission.id,
        grade: response.grade,
        status: response.status,
      }),
    );

    return submission;
  }

  checkIfURLIsAValidGitHubRepository(url: string): boolean {
    const githubRepoRegex =
      /^((git|ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?$/i;

    return githubRepoRegex.test(url);
  }
}
