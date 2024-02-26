import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { District } from '@/district/district.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { SortQuery } from '@/sort/sort.dto';
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length, MaxLength } from 'class-validator';

export class Village {
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10)
  @ApiProperty({ description: 'The village code', example: '1101012001' })
  code: string;

  @IsNotSymbol(`'()-./"*\u2019`)
  @MaxLength(100)
  @ApiProperty({ description: 'The village name', example: 'Keude Bakongan' })
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @ApiProperty({
    description: 'The district code of the village',
    example: '110101',
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
