import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user/entities/user.entity';

@Entity('game_history')
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'player1_id' })
  player1Id: number;

  @Column({ type: 'integer', name: 'player1_score' })
  player1Score: number;

  @Column({ type: 'integer', name: 'player2_id' })
  player2Id: number;

  @Column({ type: 'integer', name: 'player2_score' })
  player2Score: number;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: string;

  @ManyToMany(() => User, (user) => user.gameHistories)
  @JoinTable({ name: 'user_game_history' })
  users: User[];
}
