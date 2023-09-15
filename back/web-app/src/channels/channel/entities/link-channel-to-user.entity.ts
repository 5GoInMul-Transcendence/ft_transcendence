import { User } from "src/users/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { ChannelRole } from "../enum/channel-role.enum";

@Entity('link_channel_to_user')
export class LinkChannelToUser {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.links)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Channel, (channel) => channel.links)
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;

	@Column('varchar', {
		length: 5,
		default: ChannelRole.USER,
	})
	role: string;
}