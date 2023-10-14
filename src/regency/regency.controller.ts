import { ApiDataResponse } from '@/common/decorator/api-data-response.decorator';
import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { District } from '@/district/district.dto';
import { Island } from '@/island/island.dto';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Regency,
  RegencyFindByCodeParams,
  RegencyFindDistrictParams,
  RegencyFindDistrictQueries,
  RegencyFindIslandsQueries,
  RegencyFindQueries,
} from './regency.dto';
import { RegencyService } from './regency.service';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';

@ApiTags('Regency')
@Controller('regencies')
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @ApiOperation({ description: 'Get the regencies.' })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by regency code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiPaginatedResponse({
    model: Regency,
    description: 'Returns array of regency.',
  })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(
    @Query() queries?: RegencyFindQueries,
  ): Promise<PaginatedReturn<Regency>> {
    return this.regencyService.find(queries);
  }

  @ApiOperation({ description: 'Get a regency by its code.' })
  @ApiDataResponse({ model: Regency, description: 'Returns a regency.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no regency matches the `code`.',
  })
  @Get(':code')
  async findByCode(
    @Param() { code }: RegencyFindByCodeParams,
  ): Promise<Regency> {
    const regency = await this.regencyService.findByCode(code);

    if (regency === null) {
      throw new NotFoundException(`There are no regency with code '${code}'`);
    }

    return regency;
  }

  @ApiOperation({
    description: 'Get all districts in a regency.',
    deprecated: true,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort districts by its code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiPaginatedResponse({
    model: District,
    description: 'Returns array of districts.',
  })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no regency match with the `code`.',
  })
  @Get(':code/districts')
  async findDistricts(
    @Param() { code }: RegencyFindDistrictParams,
    @Query() queries?: RegencyFindDistrictQueries,
  ): Promise<PaginatedReturn<District>> {
    if ((await this.regencyService.findByCode(code)) === null) {
      throw new NotFoundException(`There are no regency with code '${code}'`);
    }

    return this.regencyService.findDistricts(code, queries);
  }

  @ApiOperation({
    description: 'Get all islands in a regency.',
    deprecated: true,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort islands by its code, name, or coordinate.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiPaginatedResponse({
    model: Island,
    description: 'Returns array of islands.',
  })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no regency match with the `code`.',
  })
  @Get(':code/islands')
  async findIslands(
    @Param() { code }: RegencyFindByCodeParams,
    @Query() queries?: RegencyFindIslandsQueries,
  ) {
    if ((await this.regencyService.findByCode(code)) === null) {
      throw new NotFoundException(`There are no regency with code '${code}'`);
    }

    return this.regencyService.findIslands(code, queries);
  }
}
