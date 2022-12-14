import { Type } from '@nestjs/common';
import { Field, ObjectType, Int } from '@nestjs/graphql';

import { Maybe } from '@core/logic/Maybe';

export interface PaginatedType<T> {
  nodes: Maybe<T[]>;
  totalCount: number;
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResult implements PaginatedType<T> {
    @Field((_type) => [classRef], { nullable: true })
    nodes: T[];

    @Field((_type) => Int)
    totalCount: number;
  }

  return PaginatedResult as Type<PaginatedType<T>>;
}
