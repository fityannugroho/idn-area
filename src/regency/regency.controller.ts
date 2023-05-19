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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { District, Regency } from '@prisma/client';
import {
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
    name: 'name',
    description: 'The regency name.',
    required: true,
    type: 'string',
    example: 'bandung',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by regency code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort regencies in ascending or descending order.',
    required: false,
    type: 'string',
    example: 'asc',
  })
  @ApiOkResponse({ description: 'Returns array of regency.' })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries?: RegencyFindQueries): Promise<Regency[]> {
    const { name, sortBy, sortOrder } = queries ?? {};
    return this.regencyService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }

  @ApiOperation({ description: 'Get a regency by its code.' })
  @ApiParam({
    name: 'code',
    description: 'The regency code',
    required: true,
    type: 'string',
    example: '3273',
  })
  @ApiOkResponse({ description: 'Returns a regency.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no regency matches the `code`.',
  })
  @Get(':code')
  async findByCode(@Param() params: RegencyFindByCodeParams): Promise<Regency> {
    const { code } = params;
    const regency = await this.regencyService.findByCode(code);

    if (regency === null)
      throw new NotFoundException(`There are no regency with code '${code}'`);

    return regency;
  }

  @ApiOperation({ description: 'Get all districts in a regency.' })
  @ApiParam({
    name: 'code',
    description: 'The regency code',
    required: true,
    type: 'string',
    example: '3273',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort districts by its code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort districts in ascending or descending order.',
    required: false,
    type: 'string',
    example: 'asc',
  })
  @ApiOkResponse({ description: 'Returns array of districts.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no regency match with the `code`.',
  })
  @Get(':code/districts')
  async findDistrict(
    @Param() params: RegencyFindDistrictParams,
    @Query() queries?: RegencyFindDistrictQueries,
  ): Promise<District[]> {
    const { code } = params;
    const { sortBy, sortOrder } = queries ?? {};
    const districts = await this.regencyService.findDistrics(code, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    if (districts === false)
      throw new NotFoundException(`There are no regency with code '${code}'`);

    return districts;
  }

  @ApiOperation({ description: 'Get all islands in a regency.' })
  @ApiParam({
    name: 'code',
    description: 'The regency code',
    required: true,
    type: 'string',
    example: '3273',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort islands by its code, name, or coordinate.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort islands in ascending or descending order.',
    required: false,
    type: 'string',
    example: 'asc',
  })
  @ApiOkResponse({ description: 'Returns array of islands.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no regency match with the `code`.',
  })
  @Get(':code/islands')
  async findIslands(
    @Param() params: RegencyFindByCodeParams,
    @Query() queries: RegencyFindIslandsQueries,
  ) {
    const { code } = params;
    const { sortBy, sortOrder } = queries ?? {};
    const islands = await this.regencyService.findIslands(code, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    if (islands === false)
      throw new NotFoundException(`There are no regency with code '${code}'`);

    return islands;
  }
}
