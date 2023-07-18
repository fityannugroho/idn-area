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
import { Province, Regency } from '@prisma/client';
import {
  ProvinceFindByCodeParams,
  ProvinceFindQueries,
  ProvinceFindRegencyParams,
  ProvinceFindRegencyQueries,
} from './province.dto';
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
  async find(@Query() queries?: ProvinceFindQueries): Promise<Province[]> {
    return this.provinceService.find(queries);
  }

  @ApiOperation({ description: 'Get a province by its code.' })
  @ApiParam({
    name: 'code',
    description: 'The province code',
    required: true,
    type: 'string',
    example: '32',
  })
  @ApiOkResponse({ description: 'Returns a province.' })
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

  @ApiOperation({ description: 'Get all regencies in a province.' })
  @ApiParam({
    name: 'code',
    description: 'The province code',
    required: true,
    type: 'string',
    example: '32',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort regencies by its code or name.',
    required: false,
    type: 'string',
    example: 'code',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort regencies in ascending or descending order.',
    required: false,
    type: 'string',
    example: 'asc',
  })
  @ApiOkResponse({ description: 'Returns array of regencies.' })
  @ApiBadRequestResponse({ description: 'If the `code` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If there are no province match with the `code`.',
  })
  @Get(':code/regencies')
  async findRegencies(
    @Param() { code }: ProvinceFindRegencyParams,
    @Query() queries?: ProvinceFindRegencyQueries,
  ): Promise<Regency[]> {
    const regencies = await this.provinceService.findRegencies(code, queries);

    if (regencies === null) {
      throw new NotFoundException(`There are no province with code '${code}'`);
    }

    return regencies;
  }
}
