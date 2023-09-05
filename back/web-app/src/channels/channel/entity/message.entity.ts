import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('message')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 12 })
	nickname: string;

	@Column('varchar', { length: 255 })
	content: string;

	@CreateDateColumn({
		type: 'timestamp',										// db에 저장될 데이터 형식
		precision: 6,													// 10^6 은 micro second
		default: () => 'CURRENT_TIMESTAMP(6)', // 자동으로 micro sec 단위로 현재 시간 저장
	})
	timestamp: Date;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;
}