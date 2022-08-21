import { Injectable } from '@nestjs/common';
import { Submission } from '@prisma/client';

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

@Injectable()
export class InMemorySubmissionRepository implements SubmissionRepository {
  private items: Submission[] = [];

  private filterItemsByProps(props: FilterSubmissions): Submission[] {
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
    const Submission = this.items.find((Submission) => Submission.id === id);

    if (!Submission) return null;

    return SubmissionMapper.toEntity(Submission);
  }

  async createSubmission(
    submission: CreateSubmissions,
  ): Promise<SubmissionEntity> {
    const entity = new SubmissionEntity({
      grade: 0,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
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
