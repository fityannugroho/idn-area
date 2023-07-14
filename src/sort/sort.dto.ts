import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsOptional, IsString } from 'class-validator';
import { SortOptions } from './sort.service';

/**
 * The validator class for the sort query.
 *
 * You may need to inherit this class and use `@EqualsAny()` decorator
 * for `sortBy` property to accept only specific values.
 */
export class SortQuery<T extends string = string> implements SortOptions<T> {
  @IsOptional()
  @IsString()
  sortBy?: T;

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
