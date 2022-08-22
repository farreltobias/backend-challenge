import { Injectable } from '@nestjs/common';
import { Challenge, Submission } from '@prisma/client';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Submission as SubmissionEntity } from '@domain/entities/submission';

import { SubmissionMapper } from '@infra/database/prisma/mappers/submission.mapper';
import {
  SubmissionRepository,
  FilterSubmissions,
  PageSubmissions,
  UpdateSubmissionRequest,
  CreateSubmissions,
} from '@infra/database/repositories/submission.repository';

import { InMemoryChallengeRepository } from './in-memory-challenge.repository';

type Instance = Submission & {
  challenge: Challenge | null;
};

@Injectable()
export class InMemorySubmissionRepository implements SubmissionRepository {
  private items: Instance[] = [];

  constructor(private challengeRepository: InMemoryChallengeRepository) {}

  private filterItemsByProps(props: FilterSubmissions): Instance[] {
    return this.items.filter((submission) => {
      return (
        submission.challengeId === props.challengeId &&
        submission.status === props.status &&
        (props.fromDate ? submission.createdAt >= props.fromDate : true) &&
        (props.toDate ? submission.createdAt <= props.toDate : true)
      );
    });
  }

  async pageSubmissions({
    filter,
    limit,
    offset,
  }: PageSubmissions): AsyncMaybe<SubmissionEntity[]> {
    const submissions = this.filterItemsByProps(filter).slice(
      offset,
      offset + limit,
    );

    if (!submissions.length) return null;

    return submissions.map(SubmissionMapper.toEntity);
  }

  async countSubmissions(filter: FilterSubmissions): Promise<number> {
    return this.filterItemsByProps(filter).length;
  }

  async getSubmissionById(id: string) {
    const submission = this.items.find((Submission) => Submission.id === id);

    if (!submission) return null;

    return SubmissionMapper.toEntity(submission);
  }

  async createSubmission(
    submission: CreateSubmissions,
  ): Promise<SubmissionEntity> {
    const challenge = submission.challengeId
      ? await this.challengeRepository.getChallengeById(submission.challengeId)
      : null;

    const entity = SubmissionEntity.create({
      challenge,
      grade: 0,
      status: 'PENDING',
      ...submission,
    });

    const instance = SubmissionMapper.toInstance(entity);

    this.items.push(instance);

    return entity;
  }

  async updateSubmission(
    submission: UpdateSubmissionRequest,
  ): Promise<SubmissionEntity> {
    const index = this.items.findIndex((item) => item.id === submission.id);

    const instance = this.items[index];

    this.items[index] = {
      ...instance,
      ...submission,
      updatedAt: new Date(),
    };

    return SubmissionMapper.toEntity(this.items[index]);
  }
}
