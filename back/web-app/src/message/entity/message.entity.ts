import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../../channels/channel/entity/channel.entity";
import { User } from "src/users/user/entities/user.entity";

@Entity('message')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;

	@ManyToOne(() => User, (user) => user.messages)
	@JoinColumn({ name: 'user_id' })
	user: User

	@Column('varchar', { length: 255 })
	content: string;

	@Column({
		type: 'timestamp',		// db에 저장될 데이터 형식
		precision: 6,					// 10^6 은 micro second
	})
	timestamp: Date;
}