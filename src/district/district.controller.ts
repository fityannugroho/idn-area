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
    const { name, sortBy, sortOrder } = queries ?? {};
    return this.districtService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }

  @ApiOperation({ description: 'Get a district by its code.' })
  @ApiParam({
    name: 'districtCode',
    description: 'The district code',
    required: true,
    type: 'string',
    example: '327325',
  })
  @ApiOkResponse({ description: 'Returns a district.' })
  @ApiBadRequestResponse({ description: 'If the `districtCode` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no district matches the `districtCode`.',
  })
  @Get(':districtCode')
  async findByCode(
    @Param() params: DistrictFindByCodeParams,
  ): Promise<District> {
    const { districtCode } = params;
    const district = await this.districtService.findByCode(districtCode);

    if (district === null)
      throw new NotFoundException(
        `There are no district with code '${districtCode}'`,
      );
    return district;
  }

  @ApiOperation({ description: 'Get all villages in a district.' })
  @ApiParam({
    name: 'districtCode',
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
  @ApiBadRequestResponse({ description: 'If the `districtCode` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no district match with the `districtCode`.',
  })
  @Get(':districtCode/villages')
  async findVillage(
    @Param() params: DistrictFindVillageParams,
    @Query() queries?: DistrictFindVillageQueries,
  ): Promise<Village[]> {
    const { districtCode } = params;
    const { sortBy, sortOrder } = queries ?? {};
    const villages = await this.districtService.findVillages(districtCode, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    if (villages === false)
      throw new NotFoundException(
        `There are no district with code '${districtCode}'`,
      );
    return villages;
  }
}
