import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { EqualsAny } from '@/common/decorator/EqualsAny';
import { IsNotSymbol } from '@/common/decorator/IsNotSymbol';
import { SortQuery } from '~/utils/helpers/sorter';
import { IntersectionType, PickType } from '@nestjs/mapped-types';

export class Village {
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10)
  code: string;

  @IsNotEmpty()
  @IsNotSymbol("'()-./")
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  districtCode: string;
}

export class VillageSortQuery extends SortQuery<'code' | 'name'> {
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name';
}

export class VillageFindQueries extends IntersectionType(
  PickType(Village, ['name'] as const),
  VillageSortQuery,
) {}

export class VillageFindByCodeParams extends PickType(Village, [
  'code',
] as const) {}
