import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
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
  @IsNotSymbol()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  regencyCode: string;

  @IsNotEmpty()
  @IsString()
  coordinate: string;

  @IsNotEmpty()
  @IsBooleanString()
  isPopulated: boolean;

  @IsNotEmpty()
  @IsBooleanString()
  isOutermostSmall: boolean;
}

export class IslandSortQuery extends SortQuery<'code' | 'name'> {
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name';
}

export class IslandFindQueries extends IntersectionType(
  PickType(Island, ['name'] as const),
  IslandSortQuery,
) {}

export class IslandFindByCodeParams extends PickType(Island, [
  'code',
] as const) {}
