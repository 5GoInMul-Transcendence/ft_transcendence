import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ladder')
export class Ladder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'integer', default: 0 })
  level: number;

  @Column({ type: 'integer', default: 0 })
  win: number;

  @Column({ type: 'integer', default: 0 })
  lose: number;
}
