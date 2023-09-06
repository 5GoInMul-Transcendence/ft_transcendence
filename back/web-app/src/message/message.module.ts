import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Message,
		])
	],
	providers: [
		MessageService,
	],
	exports: [
		MessageService,
	]
})
export class MessageModule {}
