import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RegencyFindByCodeParams, RegencyFindQueries } from './regency.dto';
import { Regency } from './regency.schema';
import { RegencyService } from './regency.service';

@ApiTags('Regency')
@Controller('regencies')
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @ApiOperation({ description: 'Get the regencies by its name.' })
  @ApiQuery({
    name: 'name',
    description: 'The regency name.',
    required: true,
    type: 'string',
    example: 'bandung',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by regency code or name.',
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
  @ApiOkResponse({ description: 'Returns array of regency.' })
  @ApiBadRequestResponse({ description: 'If there are invalid query values.' })
  @Get()
  async find(@Query() queries: RegencyFindQueries): Promise<Regency[]> {
    const { name, sortBy, sortOrder } = queries;
    return this.regencyService.find(name, {
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
  }

  @ApiOperation({ description: 'Get a regency by its code.' })
  @ApiParam({
    name: 'regencyCode',
    description: 'The regency code',
    required: true,
    type: 'string',
    example: '3273',
  })
  @ApiOkResponse({ description: 'Returns a regency.' })
  @ApiBadRequestResponse({ description: 'If the `regencyCode` is invalid.' })
  @Get(':regencyCode')
  async findByCode(@Param() params: RegencyFindByCodeParams): Promise<Regency> {
    const { regencyCode } = params;
    const regency = await this.regencyService.findByCode(regencyCode);

    if (regency === null)
      throw new NotFoundException(
        `There are no regency with code '${regencyCode}'`,
      );
    return regency;
  }
}
