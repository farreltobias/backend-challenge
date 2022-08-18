import { ObjectType } from '@nestjs/graphql';

import { Paginated } from '../../common/dto/models/paginated';
import { Challenge } from '../models/challenge';

@ObjectType()
export class ChallengePager extends Paginated<Challenge>(Challenge) {}
