import { ApiDataResponse } from '@/common/decorator/api-data-response.decorator';
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

@ApiTags('Regency')
@Controller('regencies')
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @ApiOperation({ description: 'Get the regencies by its name.' })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by regency code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiDataResponse({
    model: Regency,
    multiple: true,
    description: 'Returns array of regency.',
  })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries?: RegencyFindQueries): Promise<Regency[]> {
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

  @ApiOperation({ description: 'Get all districts in a regency.' })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort districts by its code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiDataResponse({
    model: District,
    multiple: true,
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
  ): Promise<District[]> {
    const districts = await this.regencyService.findDistricts(code, queries);

    if (districts === null) {
      throw new NotFoundException(`There are no regency with code '${code}'`);
    }

    return districts;
  }

  @ApiOperation({ description: 'Get all islands in a regency.' })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort islands by its code, name, or coordinate.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiDataResponse({
    model: Island,
    multiple: true,
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
    const islands = await this.regencyService.findIslands(code, queries);

    if (islands === null) {
      throw new NotFoundException(`There are no regency with code '${code}'`);
    }

    return islands;
  }
}
