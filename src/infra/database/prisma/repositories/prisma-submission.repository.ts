import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Submission } from '@domain/entities/Submission';

import {
  SubmissionRepository,
  FilterSubmissions,
  PageSubmissions,
  CreateSubmissions,
  UpdateSubmissionRequest,
} from '@infra/database/repositories/Submission.repository';

import { SubmissionMapper } from '../mappers/Submission.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSubmissionRepository implements SubmissionRepository {
  constructor(private prisma: PrismaService) {}

  async createSubmission(submission: CreateSubmissions): Promise<Submission> {
    const instance = await this.prisma.submission.create({
      include: { challenge: true },
      data: submission,
    });

    return SubmissionMapper.toEntity(instance);
  }

  async updateSubmission(
    submission: UpdateSubmissionRequest,
  ): Promise<Submission> {
    const instance = await this.prisma.submission.update({
      include: { challenge: true },
      where: {
        id: submission.id,
      },
      data: submission,
    });

    return SubmissionMapper.toEntity(instance);
  }

  async getSubmissionById(id: string) {
    const submission = await this.prisma.submission.findUnique({
      include: { challenge: true },
      where: {
        id,
      },
    });

    if (!submission) return null;

    return SubmissionMapper.toEntity(submission);
  }

  async pageSubmissions({
    filter,
    limit,
    offset,
  }: PageSubmissions): AsyncMaybe<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
      include: { challenge: true },
      where: {
        challengeId: filter.challengeId,
        status: filter.status,
        createdAt: {
          gte: filter.fromDate,
          lte: filter.toDate,
        },
      },
      take: limit,
      skip: offset,
    });

    if (!submissions.length) return null;

    return submissions.map(SubmissionMapper.toEntity);
  }

  countSubmissions(filter: FilterSubmissions): Promise<number> {
    return this.prisma.submission.count({
      where: {
        challengeId: filter.challengeId,
        status: filter.status,
        createdAt: {
          gte: filter.fromDate,
          lte: filter.toDate,
        },
      },
    });
  }
}
