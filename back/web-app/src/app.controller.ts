import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // test
  @Get('main') 
  getMain(@Req() req: any): string {
    req.session.cookie.expires = new Date(Date.now() + 20000);
    return 'Main';
  }
}
