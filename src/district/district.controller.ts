import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DistrictFindQueries } from './district.dto';
import { District } from './district.schema';
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
  async find(@Query() queries: DistrictFindQueries): Promise<District[]> {
    const { name, sortBy, sortOrder } = queries;
    return this.districtService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }
}
