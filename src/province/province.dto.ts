import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, Length, MaxLength } from 'class-validator';
import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsAreaCode } from '@/common/decorator/IsAreaCode';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { SortQuery } from '@/sort/sort.dto';

export class Province {
  @IsNotEmpty()
  @Length(2, 2)
  @IsAreaCode('province', { example: '11' })
  code: string;

  @IsNotSymbol()
  @MaxLength(100)
  @ApiProperty({ description: 'The province name', example: 'Aceh' })
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
