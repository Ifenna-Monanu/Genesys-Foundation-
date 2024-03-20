import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('ping')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiOkResponse({
    description: 'Success'
  })
  ping(): string {
    return this.appService.getHello();
  }
}
