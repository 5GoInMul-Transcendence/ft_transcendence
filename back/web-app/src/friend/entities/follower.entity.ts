import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('follower')
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', array: true, default: [] })
  followers: number[];
}
