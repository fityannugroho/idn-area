import { Controller, Get, Query } from '@nestjs/common';
import { IslandService } from './island.service';
import { IslandFindQueries } from './island.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Island')
@Controller('islands')
export class IslandController {
  constructor(private readonly islandService: IslandService) {}

  @ApiOperation({
    description: 'Get the islands by its name.',
  })
  @ApiQuery({
    name: 'name',
    description: 'The island name.',
    required: true,
    type: 'string',
    example: 'sabang',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by island code or name.',
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
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries: IslandFindQueries) {
    const { name, sortBy, sortOrder } = queries ?? {};
    return this.islandService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }
}
