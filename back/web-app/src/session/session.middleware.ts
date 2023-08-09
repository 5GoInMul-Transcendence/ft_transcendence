// import { Injectable, NestMiddleware } from '@nestjs/common';
// import * as session from 'express-session';
// import { Request, Response, NextFunction } from 'express';
// import { ConfigService } from '@nestjs/config';

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

// @Injectable()
// export class SessionMiddleware implements NestMiddleware {
//   private sessionMid;
//   constructor(private configService: ConfigService) {
//   this.sessionMid = session({
//       secret: configService.get<string>('SESSION_SECRET'),
//       resave: false,
//       saveUninitialized: false,
//       // cookie: {
//       //   httpOnly: true,
//       //   expires: new Date(Date.now() + 10000), // 세션 만료
//       // },
//     });
//   }

//   use(req: Request, res: Response, next: NextFunction) {
//     this.sessionMid(req, res, next);
//   }
// }