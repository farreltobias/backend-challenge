import {
  CorrectLessonMessage,
  CorrectLessonResponse,
} from '@application/use-cases/submissions/create-submission-use-case';

export class InMemoryKafkaService {
  private observable = (data: CorrectLessonMessage) => ({
    subscribe: (next: (value: CorrectLessonResponse) => void) => {
      next({
        submissionId: data.submissionId,
        repositoryUrl: data.submissionId,
        grade: Math.floor(Math.random() * 10) + 1,
        status: 'DONE',
      });
    },
  });

  send = jest.fn((pattern: any, data: CorrectLessonMessage) => {
    return this.observable(data);
  });
}
