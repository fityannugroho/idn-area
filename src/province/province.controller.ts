import { ApiDataResponse } from '@/common/decorator/api-data-response.decorator';
import { Regency } from '@/regency/regency.dto';
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
  Province,
  ProvinceFindByCodeParams,
  ProvinceFindQueries,
  ProvinceFindRegencyParams,
  ProvinceFindRegencyQueries,
} from './province.dto';
import { ProvinceService } from './province.service';
import { PaginatedReturn } from '@/common/interceptor/paginate.interceptor';
import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';

@ApiTags('Province')
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

  @ApiOperation({
    description: 'Get all regencies in a province.',
    deprecated: true,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort regencies by its code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiPaginatedResponse({
    model: Regency,
    description: 'Returns array of regencies.',
  })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no province match with the `code`.',
  })
  @Get(':code/regencies')
  async findRegencies(
    @Param() { code }: ProvinceFindRegencyParams,
    @Query() queries?: ProvinceFindRegencyQueries,
  ): Promise<PaginatedReturn<Regency>> {
    if ((await this.provinceService.findByCode(code)) === null) {
      throw new NotFoundException(`There are no province with code '${code}'`);
    }

    return this.provinceService.findRegencies(code, queries);
  }
}
