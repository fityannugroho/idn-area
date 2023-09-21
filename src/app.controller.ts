import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnwrapResponse } from './common/decorator/unwrap-response.decorator';
import { ResponseMessage } from './common/decorator/response-message.decorator';

@ApiTags('Home')
@Controller()
export class AppController {
  @Get()
  @UnwrapResponse()
  @ResponseMessage('Welcome to Indonesia Area API.')
  async index() {
    return {
      version: process.env.npm_package_version,
      docs: '/docs',
    };
  }
}
