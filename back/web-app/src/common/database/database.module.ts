import { Module } from '@nestjs/common';
import { databaseConfig } from './database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig)],
  providers: [databaseConfig],
})
export class DatabaseModule {}
