import { ConfigService } from '@nestjs/config';
import session from 'express-session';

export const sessionMiddleware = {
  provide: 'SESSION_MIDDLEWARE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    session({
      secret: configService.get<string>('SESSION_SECRET'), // 없으면 암호화 안 되나?
      name: 'sessionid',
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 360000,
      },
    }),
};
