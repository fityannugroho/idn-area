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
import { VillageFindByCodeParams, VillageFindQueries } from './village.dto';
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

  @ApiOperation({ description: 'Get a village by its code.' })
  @ApiParam({
    name: 'villageCode',
    description: 'The village code',
    required: true,
    type: 'string',
    example: '3204052004',
  })
  @ApiOkResponse({ description: 'Returns a village.' })
  @ApiBadRequestResponse({ description: 'If the `villageCode` is invalid.' })
  @ApiNotFoundResponse({
    description: 'If no village matches the `villageCode`.',
  })
  @Get(':villageCode')
  async findByCode(@Param() params: VillageFindByCodeParams): Promise<Village> {
    const { villageCode } = params;
    const village = await this.villageService.findByCode(villageCode);

    if (village === null)
      throw new NotFoundException(
        `There are no village with code '${villageCode}'`,
      );
    return village;
  }
}
