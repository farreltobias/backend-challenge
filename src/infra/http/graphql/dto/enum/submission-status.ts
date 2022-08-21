import { registerEnumType } from '@nestjs/graphql';

export enum SubmissionStatus {
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  DONE = 'DONE',
}

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
  description: 'Available submisson statuses',
});
