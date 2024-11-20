import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ description: 'Check the health of this API.' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string' },
      },
    },
  })
  async health() {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }
}
