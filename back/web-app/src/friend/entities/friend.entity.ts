import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('friend')
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', array: true, default: [] })
  friends: number[];
}
