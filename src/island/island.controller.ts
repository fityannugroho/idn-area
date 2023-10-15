import { ApiDataResponse } from '@/common/decorator/api-data-response.decorator';
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
  Island,
  IslandFindByCodeParams,
  IslandFindQueries,
} from './island.dto';
import { IslandService } from './island.service';
import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';

@ApiTags('Island')
@Controller('islands')
export class IslandController {
  constructor(private readonly islandService: IslandService) {}

  @ApiOperation({
    description: 'Get the islands.',
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
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(
    @Query() queries?: IslandFindQueries,
  ): Promise<PaginatedReturn<Island>> {
    const res = await this.islandService.find(queries);
    const islands = res.data.map((island) =>
      this.islandService.addDecimalCoordinate(island),
    );

    return { ...res, data: islands };
  }

  @ApiOperation({ description: 'Get an island by its code.' })
  @ApiDataResponse({ model: Island, description: 'Returns an island.' })
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
