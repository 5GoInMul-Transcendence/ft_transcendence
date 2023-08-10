import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  throwException(message: string, HttpStatus: HttpStatus): void {
    throw new HttpException(message, HttpStatus);
  }

  returnMainContents(): string {
    return 'This is main page!';
  }
}
