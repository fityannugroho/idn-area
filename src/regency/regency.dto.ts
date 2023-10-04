import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { SortQuery } from '@/sort/sort.dto';
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { DistrictSortQuery } from '../district/district.dto';
import { IslandSortQuery } from '../island/island.dto';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class Regency {
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  @ApiProperty({ description: 'The regency code', example: '1101' })
  code: string;

  @IsNotEmpty()
  @IsNotSymbol()
  @Length(3, 255)
  @ApiProperty({
    description: 'The regency name',
    example: 'KABUPATEN ACEH SELATAN',
  })
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(2, 2)
  @ApiProperty({
    description: 'The province code of the regency',
    example: '11',
  })
  provinceCode: string;
}

export class RegencySortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class RegencyFindQueries extends IntersectionType(
  PartialType(PickType(Regency, ['name', 'provinceCode'] as const)),
  RegencySortQuery,
  PaginationQuery,
) {}

export class RegencyFindByCodeParams extends PickType(Regency, [
  'code',
] as const) {}

export class RegencyFindDistrictParams extends PickType(Regency, [
  'code',
] as const) {}

export class RegencyFindDistrictQueries extends IntersectionType(
  DistrictSortQuery,
  PaginationQuery,
) {}

export class RegencyFindIslandsQueries extends IntersectionType(
  IslandSortQuery,
  PaginationQuery,
) {}
