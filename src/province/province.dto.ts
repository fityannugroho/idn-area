import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { SortQuery } from '@/sort/sort.dto';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { RegencySortQuery } from '../regency/regency.dto';

export class Province {
  @IsNotEmpty()
  @IsNumberString()
  @Length(2, 2)
  code: string;

  @IsNotEmpty()
  @IsNotSymbol()
  @Length(3, 255)
  name: string;
}

export class ProvinceSortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class ProvinceFindQueries extends IntersectionType(
  PartialType(PickType(Province, ['name'] as const)),
  ProvinceSortQuery,
) {}

export class ProvinceFindByCodeParams extends PickType(Province, [
  'code',
] as const) {}

export class ProvinceFindRegencyParams extends PickType(Province, [
  'code',
] as const) {}

export class ProvinceFindRegencyQueries extends RegencySortQuery {}
