import { Injectable } from '@nestjs/common';

import { Submission } from '@domain/entities/submission';

import {
  PageSubmissions,
  SubmissionRepository,
} from '@infra/database/repositories/submission.repository';
import { PaginatedType } from '@infra/http/graphql/common/dto/models/paginated';

type PageSubmissionsRequest = PageSubmissions;

type PageSubmissionsResponse = PaginatedType<Submission>;

@Injectable()
export class PageSubmissionsUseCase {
  constructor(private submissionRepository: SubmissionRepository) {}

  async handle({
    filter = {},
    limit,
    offset,
  }: PageSubmissionsRequest): Promise<PageSubmissionsResponse> {
    const submissions = await this.submissionRepository.pageSubmissions({
      filter,
      limit,
      offset,
    });

    const totalCount = await this.submissionRepository.countSubmissions(filter);

    return {
      nodes: submissions,
      totalCount,
    };
  }
}
