import { IsOptional, Length } from 'class-validator';
import { EqualsAny } from 'src/common/decorator/EqualsAny';
import { IsNotSymbol } from 'src/common/decorator/IsNotSymbol';

export class ProvinceFindQueries {
  @IsOptional()
  @IsNotSymbol()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name' = 'code';

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
