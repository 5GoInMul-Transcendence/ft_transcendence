import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('ban')
export class Ban {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel, (channel) => channel.ban)
	@JoinColumn({name: 'channel_id'})
	channel: Channel;

  @Column('integer', { array: true, default: [] })
	bans: number[];
}