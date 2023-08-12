import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('block')
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', array: true, default: [] })
  blocks: number[];
}
