import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = {
  provide: 'DATA_SOURCE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      schema: configService.get('DB_SCHEMA'),
      database: configService.get('DB_NAME'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      entities: [__dirname + '/../../**/*.entity.{js, ts}'],
      synchronize: true,
      logging: true,
      // seeds: ['src/database/seeds/**/*{.ts,.js}'], // 데이터베이스에 랜덤한 값을 넣어볼 수 있다. 나중에 사용할 수 있음.
    };
    return databaseOptions;
  },
};
