import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new HttpException('/main', HttpStatus.FOUND);
    return 'Hello World!';
  }
}
