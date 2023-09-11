import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../../../message/entities/message.entity";
import { LinkChannelToUser } from "./link-channel-to-user.entity";
import { Ban } from "./ban.entity";

@Entity('channel')
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 24 })
	name: string;

	@Column('varchar', { length: 9 })
	mode: string;

	@Column('varchar', {
		length: 72,
		nullable: true,
		default: null,
	})
	password: string | null;

	@OneToOne(() => Ban, (bans) => bans.channel)
	ban: Ban;

	@OneToMany(() => LinkChannelToUser, (link) => link.channel)
	links: LinkChannelToUser[];

	@OneToMany(() => Message, (message) => message.channel)
	messages: Message[];
}