import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AchievementGrade } from '../achievement-grade';

@Entity('achievement')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'json', name: 'game_win', default: { level: 0, point: 0 } })
  gameWin: AchievementGrade;

  @Column({ type: 'varchar', length: '10', array: true, default: [] })
  achievements: string[];
}
