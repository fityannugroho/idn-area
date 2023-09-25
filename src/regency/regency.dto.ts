import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { SortQuery } from '@/sort/sort.dto';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { DistrictSortQuery } from '../district/district.dto';
import { IslandSortQuery } from '../island/island.dto';

export class Regency {
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  @ApiProperty({ description: 'The regency code', example: '1101' })
  code: string;

  @IsNotEmpty()
  @IsNotSymbol()
  @Length(3, 255)
  @ApiProperty({ example: 'KABUPATEN ACEH SELATAN' })
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(2, 2)
  @ApiProperty({ example: '11' })
  provinceCode: string;
}

export class RegencySortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
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
