import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // test
  @Get()
  throwException(): void {
    this.appService.throwException('현재 페이지가 존재하지 않습니다!', HttpStatus.OK);
  }

  // test
  @Get('main') 
  returnMainContents(): string {
    return this.appService.returnMainContents();
  }
}
