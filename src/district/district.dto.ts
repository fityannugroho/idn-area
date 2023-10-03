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
import { VillageSortQuery } from '../village/village.dto';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class District {
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @ApiProperty({ description: 'The district code', example: '110101' })
  code: string;

  @IsNotEmpty()
  @IsNotSymbol("'()-./")
  @Length(3, 255)
  @ApiProperty({ description: 'The district name', example: 'Bakongan' })
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  @ApiProperty({ example: '1101' })
  regencyCode: string;
}

export class DistrictSortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class DistrictFindQueries extends IntersectionType(
  PartialType(PickType(District, ['name'] as const)),
  DistrictSortQuery,
  PaginationQuery,
) {}

export class DistrictFindByCodeParams extends PickType(District, [
  'code',
] as const) {}

export class DistrictFindVillageParams extends PickType(District, [
  'code',
] as const) {}

export class DistrictFindVillageQueries extends IntersectionType(
  VillageSortQuery,
  PaginationQuery,
) {}
