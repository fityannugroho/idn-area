import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsNotSymbol } from '../common/decorator/IsNotSymbol';
import { EqualsAny } from '../common/decorator/EqualsAny';
import { SortQuery } from '../common/helper/sort';
import { IntersectionType, PickType } from '@nestjs/mapped-types';

export class Island {
  @IsNotEmpty()
  @IsNumberString()
  @Length(9, 9)
  code: string;

  @IsNotEmpty()
  @IsString()
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

export class IslandSortQuery extends SortQuery<'code' | 'name' | 'coordinate'> {
  @EqualsAny(['code', 'name', 'coordinate'])
  sortBy: 'code' | 'name';
}

export class IslandFindQueries extends IntersectionType(
  PickType(Island, ['name'] as const),
  IslandSortQuery,
) {}

export class IslandFindByCodeParams extends PickType(Island, [
  'code',
] as const) {}
