import { ConfigService } from '@nestjs/config';
import session from 'express-session';

export const sessionMiddleware = {
  provide: 'SESSION_MIDDLEWARE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      name: 'sessionid',
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 3600000
      },
    }),
};
