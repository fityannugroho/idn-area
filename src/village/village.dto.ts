import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { SortQuery } from '@/sort/sort.dto';
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class Village {
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10)
  @ApiProperty({ description: 'The village code', example: '1101012001' })
  code: string;

  @IsNotEmpty()
  @IsNotSymbol("'()-./")
  @Length(3, 255)
  @ApiProperty({ description: 'The village name', example: 'Keude Bakongan' })
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @ApiProperty({ example: '110101' })
  districtCode: string;
}

export class VillageSortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class VillageFindQueries extends IntersectionType(
  PartialType(PickType(Village, ['name'] as const)),
  VillageSortQuery,
  PaginationQuery,
) {}

export class VillageFindByCodeParams extends PickType(Village, [
  'code',
] as const) {}
