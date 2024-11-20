import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ description: 'Base route of this API.' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string' },
        version: {
          type: 'string',
          description: 'The version of this API.',
          example: '1.0.0',
        },
      },
    },
  })
  async index() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Welcome to Indonesia Area API.',
      version: process.env.npm_package_version,
      docs: '/docs',
    };
  }

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
