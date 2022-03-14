import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { EqualsAny } from 'src/common/decorator/EqualsAny';
import { IsNotSymbol } from 'src/common/decorator/IsNotSymbol';

export class DistrictFindQueries {
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

export class DistrictFindByCodeParams {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 6)
  districtCode: string;
}

export class DistrictFindVillageParams {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 6)
  districtCode: string;
}
export class DistrictFindVillageQueries {
  @IsOptional()
  @EqualsAny(['code', 'name'])
  sortBy: 'code' | 'name';

  @IsOptional()
  @EqualsAny(['asc', 'desc'])
  sortOrder: 'asc' | 'desc';
}
