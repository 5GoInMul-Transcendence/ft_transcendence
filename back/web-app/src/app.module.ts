import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { SignupModule } from './signup/signup.module';
import * as session from 'express-session';
import { AuthMiddleware } from './session/auth.middleware';
import { SessionModule } from './session/session.module';


@Module({
  imports: [LoginModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    SignupModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // test
    console.log('Session middleware: Receive request');
    consumer
      .apply(
        session({
          secret: this.configService.get<string>('SESSION_SECRET'), // 없으면 암호화 안 되나?
          resave: true,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            // expires: new Date(Date.now() + 10000),
            maxAge: 360000,
          },
        }),
        // SessionMiddleware,
      )
      .forRoutes('*'); // 모든 라우트에 세션 미들웨어를 적용
    consumer
      .apply(
        AuthMiddleware,
      )
      .exclude('login/(.*)', 'signup/(.*)', '/') //test '/'
      .forRoutes('*');
  }
}
