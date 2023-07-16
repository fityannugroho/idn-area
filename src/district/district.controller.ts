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
import { District, Village } from '@prisma/client';
import {
  DistrictFindByCodeParams,
  DistrictFindQueries,
  DistrictFindVillageParams,
  DistrictFindVillageQueries,
} from './district.dto';
import { DistrictService } from './district.service';

@ApiTags('District')
@Controller('districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @ApiOperation({ description: 'Get districts by its name.' })
  @ApiQuery({
    name: 'name',
    description: 'The district name.',
    required: true,
    type: 'string',
    example: 'bandung',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by district code or name.',
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
  @ApiOkResponse({ description: 'Returns array of district.' })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries?: DistrictFindQueries): Promise<District[]> {
    return this.districtService.find(queries);
  }

  @ApiOperation({ description: 'Get a district by its code.' })
  @ApiParam({
    name: 'code',
    description: 'The district code',
    required: true,
    type: 'string',
    example: '327325',
  })
  @ApiOkResponse({ description: 'Returns a district.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no district matches the `code`.',
  })
  @Get(':code')
  async findByCode(
    @Param() { code }: DistrictFindByCodeParams,
  ): Promise<District> {
    const district = await this.districtService.findByCode(code);

    if (district === null) {
      throw new NotFoundException(`There are no district with code '${code}'`);
    }

    return district;
  }

  @ApiOperation({ description: 'Get all villages in a district.' })
  @ApiParam({
    name: 'code',
    description: 'The district code',
    required: true,
    type: 'string',
    example: '327325',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort villages by its code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort villages in ascending or descending order.',
    required: false,
    type: 'string',
    example: 'asc',
  })
  @ApiOkResponse({ description: 'Returns array of villages.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no district match with the `code`.',
  })
  @Get(':code/villages')
  async findVillage(
    @Param() { code }: DistrictFindVillageParams,
    @Query() queries?: DistrictFindVillageQueries,
  ): Promise<Village[]> {
    const villages = await this.districtService.findVillages(code, queries);

    if (villages === null) {
      throw new NotFoundException(`There are no district with code '${code}'`);
    }

    return villages;
  }
}
