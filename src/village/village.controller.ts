import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { VillageFindQueries } from './village.dto';
import { Village } from './village.schema';
import { VillageService } from './village.service';

@ApiTags('Village')
@Controller('villages')
export class VillageController {
  constructor(private readonly villageService: VillageService) {}

  @ApiOperation({ description: 'Get villages by its name.' })
  @ApiQuery({
    name: 'name',
    description: 'The village name.',
    required: true,
    type: 'string',
    example: 'cinunuk',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by village code or name.',
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
  @ApiOkResponse({ description: 'Returns array of village.' })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries: VillageFindQueries): Promise<Village[]> {
    const { name, sortBy, sortOrder } = queries;
    return this.villageService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }
}
