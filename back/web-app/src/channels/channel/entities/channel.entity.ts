import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../../../message/entities/message.entity";
import { LinkChannelToUser } from "./link-channel-to-user.entity";

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

  @Column('integer', { array: true, default: [] })
	bans: number[];

	@OneToMany(() => LinkChannelToUser, (link) => link.channel)
	links: LinkChannelToUser[];

	@OneToMany(() => Message, (message) => message.channel)
	messages: Message[];
}