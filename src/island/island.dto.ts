import { PaginationQuery } from '@/common/dto/pagination.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { SortQuery } from '@/sort/sort.dto';
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { EqualsAny } from '../common/decorator/EqualsAny';
import { IsNotSymbol } from '../common/decorator/IsNotSymbol';

export class Island {
  @IsNotEmpty()
  @IsNumberString()
  @Length(9, 9)
  @ApiProperty({ description: 'The island code', example: '110140001' })
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
  @IsNumberString()
  @Length(4, 4)
  @ApiProperty({
    description: `The regency code of the island.
      Providing an empty string will filter islands that are not part of any regency.`,
    example: '1101',
  })
  regencyCode?: string | null;

  @ApiProperty({ example: 3.317622222222222 })
  latitude?: number;

  @ApiProperty({ example: 97.12825833333332 })
  longitude?: number;
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
