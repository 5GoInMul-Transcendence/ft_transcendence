import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('channel')
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 16 })
	name: string;

	@Column('varchar', { length: 9 })
	mode: string;

	@Column({
		type: 'integer',
		nullable: true,
		default: null,
	})
	password: number | null;
}