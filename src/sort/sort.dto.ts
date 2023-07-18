import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsOptional, IsString } from 'class-validator';
import { SortOptions } from './sort.service';

/**
 * The validator class for the sort query.
 *
 * You may need to inherit this class and use `@EqualsAny()` decorator
 * for `sortBy` property to accept only specific values.
 */
export class SortQuery<
  T extends Record<string, unknown> = Record<string, unknown>,
> implements SortOptions<T>
{
  @IsOptional()
  @IsString()
  readonly sortBy?: keyof T;

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  readonly sortOrder?: 'asc' | 'desc';
}
