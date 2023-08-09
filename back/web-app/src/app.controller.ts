import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('I am app controller');
    return this.appService.getHello();
  }

  // test
  @Get('main') 
  getMain(): string {
    return 'Main';
  }
}
