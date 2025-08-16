import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length, MaxLength } from 'class-validator';
import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { SortQuery } from '@/sort/sort.dto';

export class District {
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @ApiProperty({ description: 'The district code', example: '110101' })
  code: string;

  @IsNotSymbol("'()-./")
  @MaxLength(100)
  @ApiProperty({ description: 'The district name', example: 'Bakongan' })
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  @ApiProperty({
    description: 'The regency code of the district',
    example: '1101',
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
