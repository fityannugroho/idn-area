import { IntersectionType, PickType } from '@nestjs/mapped-types';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { SortQuery } from '@/sort/sort.dto';
import { EqualsAny } from '../common/decorator/EqualsAny';
import { IsNotSymbol } from '../common/decorator/IsNotSymbol';

export class Island {
  @IsNotEmpty()
  @IsNumberString()
  @Length(9, 9)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(30, 30)
  coordinate: string;

  @IsNotEmpty()
  @IsBooleanString()
  isOutermostSmall: boolean;

  @IsNotEmpty()
  @IsBooleanString()
  isPopulated: boolean;

  @IsNotEmpty()
  @IsNotSymbol("'-/")
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsNumberString()
  @Length(4, 4)
  regencyCode?: string;
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
