import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../../../message/entities/message.entity";
import { LinkChannelToUser } from "./link-channel-to-user.entity";

@Entity('channel')
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 32 })
	name: string;

	@Column('varchar', { length: 9 })
	mode: string;

	@Column('varchar', {
		length: 72,
		nullable: true,
		default: null,
	})
	password: string | null;

	@OneToMany(() => LinkChannelToUser, (link) => link.channel)
	links: LinkChannelToUser[];

	@OneToMany(() => Message, (message) => message.channel)
	messages: Message[];
}