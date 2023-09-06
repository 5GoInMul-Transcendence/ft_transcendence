import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user/user.module';
import { SignupModule } from './signup/signup.module';
import { AuthMiddleware } from './session/auth.middleware';
import { SessionModule } from './session/session.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { FriendModule } from './friend/friend.module';
import { MainModule } from './main/main.module';
import { ChannelsModule } from './channels/channels.module';
import { GameModule } from './game/game.module';
import { MatchModule } from './main/match/match.module';
import { MainUserModule } from './main/mainuser/main-user.module';
import { ImageModule } from './common/image/image.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MeModule } from './users/me/me.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: 'avatar',
    }),
    LoginModule,
    UserModule,
    SignupModule,
    SessionModule,
    DatabaseModule,
    AuthModule,
    FriendModule,
    MainModule,
    ChannelsModule,
    MainUserModule,
    MatchModule,
    GameModule,
    ImageModule,
    MeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(@Inject('SESSION_MIDDLEWARE') private sessionMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    // test
    console.log('Session middleware: Receive request');
    consumer.apply(this.sessionMiddleware).forRoutes('*'); // 모든 라우트에 세션 미들웨어를 적용
    consumer
      .apply(AuthMiddleware)
      .exclude('login(.*)', 'signup(.*)', '/') //test '/'
      .forRoutes('*');
  }
}
