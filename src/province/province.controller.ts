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
} from '@nestjs/swagger';
import {
  Province,
  ProvinceFindByCodeParams,
  ProvinceFindQueries,
} from './province.dto';
import { ProvinceService } from './province.service';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';

@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @ApiOperation({ description: 'Get the provinces.' })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by province code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiPaginatedResponse({
    model: Province,
    description: 'Returns array of province.',
  })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(
    @Query() queries?: ProvinceFindQueries,
  ): Promise<PaginatedReturn<Province>> {
    return this.provinceService.find(queries);
  }

  @ApiOperation({ description: 'Get a province by its code.' })
  @ApiDataResponse({
    model: Province,
    description: 'Returns a province.',
  })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({ description: 'If there are no match province.' })
  @Get(':code')
  async findByCode(
    @Param() { code }: ProvinceFindByCodeParams,
  ): Promise<Province> {
    const province = await this.provinceService.findByCode(code);

    if (province === null) {
      throw new NotFoundException(`There are no province with code '${code}'`);
    }

    return province;
  }
}
