import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsAreaCode } from '@/common/decorator/IsAreaCode';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { SortQuery } from '@/sort/sort.dto';

export class District {
  @IsNotEmpty()
  @IsAreaCode('district')
  @ApiProperty({ description: 'The district code', example: '11.01.01' })
  code: string;

  @IsNotSymbol("'()-./")
  @MaxLength(100)
  @ApiProperty({ description: 'The district name', example: 'Bakongan' })
  name: string;

  @IsNotEmpty()
  @IsAreaCode('regency')
  @ApiProperty({
    description: 'The regency code of the district',
    example: '11.01',
  })
  regencyCode: string;
}

export class DistrictSortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class DistrictFindQueries extends IntersectionType(
  PartialType(PickType(District, ['name', 'regencyCode'] as const)),
  DistrictSortQuery,
  PaginationQuery,
) {}

export class DistrictFindByCodeParams extends PickType(District, [
  'code',
] as const) {}

export class DistrictWithParent extends District {
  parent: {
    regency: Regency;
    province: Province;
  };
}
