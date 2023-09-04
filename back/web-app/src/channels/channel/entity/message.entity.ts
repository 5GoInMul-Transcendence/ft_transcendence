import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('message')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('integer', { name: 'user_id '},)
	userId: number;

	@Column('varchar', { length: 255 })
	content: string;

	@Column({
		type: 'timestamp',		// db에 저장될 데이터 형식
		precision: 6,					// 10^6 은 micro second
	})
	timestamp: Date;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;
}