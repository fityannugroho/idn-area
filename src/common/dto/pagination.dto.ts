import { appConfig } from 'common/config/app';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQuery {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'The page number.' })
  readonly page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(appConfig.pagination.maxPageSize)
  @ApiPropertyOptional({
    description: 'The number of items per page.',
    example: appConfig.pagination.defaultPageSize,
  })
  readonly limit?: number;
}
