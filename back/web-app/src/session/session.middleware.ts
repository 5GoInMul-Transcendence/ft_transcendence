import { Injectable, NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

// export const sessionOPtions: any = {
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) => {
//     const options: session.SessionOptions = {
//       secret: configService.get<string>('SESSION_SECRET'),
//       resave: false,
//       saveUninitialized: false,
//     }
//     return options;
//   }
// }

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    })(req, res, next);
  }
}