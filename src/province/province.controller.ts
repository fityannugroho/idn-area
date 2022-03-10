import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProvinceFindQueries } from './province.dto';
import { Province } from './province.schema';
import { ProvinceService } from './province.service';

@ApiTags('Province')
@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @ApiOperation({
    description: `Get the provinces. If the \`name\` is empty, all provinces will be returned.
      Otherwise, it will only return the provinces with the matching name.
    `,
  })
  @ApiQuery({
    name: 'name',
    description: 'Get provinces by its name.',
    required: false,
    type: 'string',
    example: 'jawa',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by province code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort provinces in ascending or descending order.',
    required: false,
    type: 'string',
    example: 'asc',
  })
  @ApiOkResponse({ description: 'Returns array of province.' })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries: ProvinceFindQueries): Promise<Province[]> {
    const { name, sortBy, sortOrder } = queries;
    return this.provinceService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }
}
