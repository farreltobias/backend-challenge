import { ObjectType } from '@nestjs/graphql';

import { Paginated } from '../../../common/dto/models/paginated';
import { Submission } from '../../models/submission';

@ObjectType()
export class SubmissionPager extends Paginated<Submission>(Submission) {}
