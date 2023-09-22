import { Module } from '@nestjs/common';
import { MainUserService } from './main-user.service';

@Module({
  providers: [MainUserService],
  exports: [MainUserService],
})
export class MainUserModule {}
