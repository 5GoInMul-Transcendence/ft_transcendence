import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ladder')
export class Ladder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'integer' })
  level: number;

  @Column({ type: 'integer' })
  win: number;

  @Column({ type: 'integer' })
  lose: number;
}
