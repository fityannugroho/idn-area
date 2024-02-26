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
  Village,
  VillageFindByCodeParams,
  VillageFindQueries,
  VillageWithParent,
} from './village.dto';
import { VillageService } from './village.service';
import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';

@ApiTags('Village')
@Controller('villages')
export class VillageController {
  constructor(private readonly villageService: VillageService) {}

  @ApiOperation({ description: 'Get the villages.' })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by village code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiPaginatedResponse({
    model: Village,
    description: 'Returns array of village.',
  })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(
    @Query() queries?: VillageFindQueries,
  ): Promise<PaginatedReturn<Village>> {
    return this.villageService.find(queries);
  }

  @ApiOperation({ description: 'Get a village by its code.' })
  @ApiDataResponse({
    model: VillageWithParent,
    description: 'Returns a village.',
  })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no village matches the `code`.',
  })
  @Get(':code')
  async findByCode(
    @Param() { code }: VillageFindByCodeParams,
  ): Promise<VillageWithParent> {
    const village = await this.villageService.findByCode(code);

    if (village === null) {
      throw new NotFoundException(`There are no village with code '${code}'`);
    }

    return village;
  }
}
