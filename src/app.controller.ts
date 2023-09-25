import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UnwrapResponse } from './common/decorator/unwrap-response.decorator';
import { ResponseMessage } from './common/decorator/response-message.decorator';

@ApiTags('Home')
@Controller()
export class AppController {
  @Get()
  @UnwrapResponse()
  @ResponseMessage('Welcome to Indonesia Area API.')
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
      version: process.env.npm_package_version,
      docs: '/docs',
    };
  }
}
