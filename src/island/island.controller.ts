import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { IslandService } from './island.service';
import { IslandFindByCodeParams, IslandFindQueries } from './island.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Island } from '@prisma/client';

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

  @ApiOperation({ description: 'Get an island by its code.' })
  @ApiParam({
    name: 'code',
    description: 'The island code',
    required: true,
    type: 'string',
    example: '110140001',
  })
  @ApiOkResponse({ description: 'Returns an island.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no island matches the `code`.',
  })
  @Get(':code')
  async findByCode(@Param() params: IslandFindByCodeParams): Promise<Island> {
    const { code } = params;
    const island = await this.islandService.findByCode(code);

    if (!island) {
      throw new NotFoundException(`Island with code ${code} not found.`);
    }

    return island;
  }
}
