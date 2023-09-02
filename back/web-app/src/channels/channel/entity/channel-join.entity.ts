import { User } from "src/users/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('channel_join')
export class ChannelJoin {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.joins)
	@JoinColumn({ name: 'user_id' })
	userId: User;

	@ManyToOne(() => Channel)
	@JoinColumn({ name: 'channel_id' })
	channelId: Channel;

	@Column('varchar', {
		length: 5,
		default: 'user',
	})
	role: string;
}