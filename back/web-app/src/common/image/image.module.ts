import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './image.config';

@Module({
  imports: [MulterModule.register(multerOptions)],
  exports: [MulterModule],
})
export class ImageModule {}
