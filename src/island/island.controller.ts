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
import {
  Island,
  IslandFindByCodeParams,
  IslandFindQueries,
} from './island.dto';
import { IslandService } from './island.service';

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
    description: 'Sort islands by its code, name, or coordinate.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiOkResponse({ description: 'Returns array of islands.' })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries?: IslandFindQueries): Promise<Island[]> {
    return (await this.islandService.find(queries)).map((island) =>
      this.islandService.addDecimalCoordinate(island),
    );
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
  async findByCode(@Param() { code }: IslandFindByCodeParams): Promise<Island> {
    const island = await this.islandService.findByCode(code);

    if (island === null) {
      throw new NotFoundException(`Island with code ${code} not found.`);
    }

    return this.islandService.addDecimalCoordinate(island);
  }
}
