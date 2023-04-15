import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class AppController {
  @Get()
  async index() {
    return {
      message: 'Welcome to Indonesia Area API.',
      version: process.env.npm_package_version,
      docs: '/docs',
    };
  }
}
