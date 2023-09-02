import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('channel')
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 24 })
	name: string;

	@Column('varchar', { length: 9 })
	mode: string;

	@Column('varchar', {
		length: 4,
		nullable: true,
		default: null,
	})
	password: string | null;
}