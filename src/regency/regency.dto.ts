import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';
import { IsNotSymbol } from 'src/common/decorator/IsNotSymbol';

export class RegencyFindQueries {
  @IsNotEmpty()
  @IsNotSymbol()
  @Length(3, 255)
  name: string;
}

export class RegencyFindByCodeParams {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(4, 4)
  regencyCode: string;
}
