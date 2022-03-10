import { IsOptional } from 'class-validator';
import { EqualsAny } from 'src/common/decorator/EqualsAny';

export class ProvinceFindQueries {
  @IsOptional()
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name' = 'code';

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
