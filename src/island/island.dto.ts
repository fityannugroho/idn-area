import { SortQuery } from '@/sort/sort.dto';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { EqualsAny } from '../common/decorator/EqualsAny';
import { IsNotSymbol } from '../common/decorator/IsNotSymbol';

export class Island {
  @IsNotEmpty()
  @IsNumberString()
  @Length(9, 9)
  @ApiProperty({ description: 'The island code', example: '1101014001' })
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

  @IsNotEmpty()
  @IsNotSymbol("'-/")
  @Length(3, 255)
  @ApiProperty({ example: 'Pulau Batukapal' })
  name: string;

  @IsOptional()
  @IsNumberString()
  @Length(4, 4)
  @ApiProperty({ example: '1101' })
  regencyCode?: string;

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
  PickType(Island, ['name'] as const),
  IslandSortQuery,
) {}

export class IslandFindByCodeParams extends PickType(Island, [
  'code',
] as const) {}
