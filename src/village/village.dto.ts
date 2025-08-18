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
import { District } from '@/district/district.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { SortQuery } from '@/sort/sort.dto';

export class Village {
  @IsNotEmpty()
  @IsAreaCode('village', {
    description: 'The village code',
    example: '11.01.01.2001',
  })
  code: string;

  @IsNotSymbol(`'()-./"*\u2019`)
  @MaxLength(100)
  @ApiProperty({ description: 'The village name', example: 'Keude Bakongan' })
  name: string;

  @IsNotEmpty()
  @IsAreaCode('district', {
    description: 'The district code of the village',
    example: '11.01.01',
  })
  districtCode: string;
}

export class VillageSortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class VillageFindQueries extends IntersectionType(
  PartialType(PickType(Village, ['name', 'districtCode'] as const)),
  VillageSortQuery,
  PaginationQuery,
) {}

export class VillageFindByCodeParams extends PickType(Village, [
  'code',
] as const) {}

export class VillageWithParent extends Village {
  parent: {
    district: District;
    regency: Regency;
    province: Province;
  };
}
