import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PaginationQuery } from '@/common/dto/pagination.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { SortQuery } from '@/sort/sort.dto';
import { EqualsAny } from '../common/decorator/EqualsAny';
import { IsAreaCode } from '../common/decorator/IsAreaCode';
import { IsNotSymbol } from '../common/decorator/IsNotSymbol';

export class Island {
  @IsNotEmpty()
  @IsAreaCode('island', { example: '11.01.40001' })
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(30, 30)
  @ApiProperty({ example: `03°19'03.44" N 097°07'41.73" E` })
  coordinate: string;

  @IsNotEmpty()
  @IsBooleanString()
  @ApiProperty({ example: false })
  isOutermostSmall: boolean;

  @IsNotEmpty()
  @IsBooleanString()
  @ApiProperty({ example: false })
  isPopulated: boolean;

  @IsNotSymbol("'-/")
  @MaxLength(100)
  @ApiProperty({
    description: 'The island name',
    example: 'Pulau Batukapal',
  })
  name: string;

  @ValidateIf((o) => o.regencyCode)
  @IsOptional()
  @IsAreaCode('regency', {
    description: `The regency code of the island.`,
    example: '11.01',
    nullable: true,
  })
  regencyCode: string | null;

  @ApiProperty({ example: 3.317622222222222, nullable: true })
  latitude: number | null;

  @ApiProperty({ example: 97.12825833333332, nullable: true })
  longitude: number | null;
}

export class IslandSortQuery extends SortQuery {
  @EqualsAny(['code', 'name', 'coordinate'])
  readonly sortBy?: 'code' | 'name' | 'coordinate';
}

export class IslandFindQueries extends IntersectionType(
  PartialType(PickType(Island, ['name', 'regencyCode'] as const)),
  IslandSortQuery,
  PaginationQuery,
) {}

export class IslandFindByCodeParams extends PickType(Island, [
  'code',
] as const) {}

export class IslandWithParent extends Island {
  parent: {
    regency?: Regency | null;
    province: Province;
  };
}
