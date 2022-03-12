import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RegencyFindQueries } from './regency.dto';
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
  @ApiOkResponse({ description: 'Returns array of regency.' })
  @ApiBadRequestResponse({ description: 'If the `name` is invalid.' })
  @Get()
  async find(@Query() queries: RegencyFindQueries): Promise<Regency[]> {
    const { name } = queries;
    return this.regencyService.find(name);
  }
}
