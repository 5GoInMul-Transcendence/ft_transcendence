import { Module } from '@nestjs/common';
import { LadderService } from './ladder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ladder } from './entities/ladder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ladder])],
  providers: [LadderService],
})
export class LadderModule {}
