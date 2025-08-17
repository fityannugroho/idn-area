import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length, MaxLength } from 'class-validator';
import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsAreaCode } from '@/common/decorator/IsAreaCode';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { Province } from '@/province/province.dto';
import { SortQuery } from '@/sort/sort.dto';

export class Regency {
  @IsNotEmpty()
  @IsAreaCode('regency')
  @ApiProperty({ description: 'The regency code', example: '11.01' })
  code: string;

  @IsNotSymbol()
  @MaxLength(100)
  @ApiProperty({
    description: 'The regency name',
    example: 'Kabupaten Aceh Selatan',
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

export class RegencyWithParent extends Regency {
  parent: {
    province: Province;
  };
}
