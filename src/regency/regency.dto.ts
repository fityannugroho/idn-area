import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { SortQuery } from '@/sort/sort.dto';
import { DistrictSortQuery } from '../district/district.dto';
import { IslandSortQuery } from '../island/island.dto';

export class Regency {
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  code: string;

  @IsNotEmpty()
  @IsNotSymbol()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(2, 2)
  provinceCode: string;
}

export class RegencySortQuery extends SortQuery<'code' | 'name'> {
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name';
}

export class RegencyFindQueries extends IntersectionType(
  PickType(Regency, ['name'] as const),
  RegencySortQuery,
) {}

export class RegencyFindByCodeParams extends PickType(Regency, [
  'code',
] as const) {}

export class RegencyFindDistrictParams extends PickType(Regency, [
  'code',
] as const) {}

export class RegencyFindDistrictQueries extends DistrictSortQuery {}

export class RegencyFindIslandsQueries extends IslandSortQuery {}
