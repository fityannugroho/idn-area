import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { SortQuery } from '@/sort/sort.dto';
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length, MaxLength } from 'class-validator';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export class Province {
  @IsNotEmpty()
  @IsNumberString()
  @Length(2, 2)
  @ApiProperty({ description: 'The province code', example: '11' })
  code: string;

  @IsNotSymbol()
  @MaxLength(100)
  @ApiProperty({ description: 'The province name', example: 'ACEH' })
  name: string;
}

export class ProvinceSortQuery extends SortQuery {
  @EqualsAny(['code', 'name'])
  readonly sortBy?: 'code' | 'name';
}

export class ProvinceFindQueries extends IntersectionType(
  PartialType(PickType(Province, ['name'] as const)),
  ProvinceSortQuery,
  PaginationQuery,
) {}

export class ProvinceFindByCodeParams extends PickType(Province, [
  'code',
] as const) {}
