import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './block.entity';
import { UserModule } from '../users/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Block]), UserModule],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
