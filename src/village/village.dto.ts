import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { EqualsAny } from '~/src/common/decorator/EqualsAny';
import { IsNotSymbol } from '~/src/common/decorator/IsNotSymbol';

export class VillageFindQueries {
  @IsNotEmpty()
  @IsNotSymbol()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name';

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  sortOrder: 'asc' | 'desc';
}

export class VillageFindByCodeParams {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(10, 10)
  villageCode: string;
}
