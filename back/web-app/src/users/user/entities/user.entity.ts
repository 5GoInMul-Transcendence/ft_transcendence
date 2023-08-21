import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TwoFactorStatus } from "../../enums/twoFactor-status.enum";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36 }) // length: 12
  nickname: string;

  @Column('varchar', { length: 64 })
  avatar: string;

  @Column('varchar', {
    length: 320,
    nullable: true, // 기본값은 false
    default: null,
  })
  mail: string;

  @Column('varchar', {
    length: 11,
    nullable: true,
    default: null,
  })
  phone: string;

  @Column({
    type: 'enum',
    name: 'two_factor',
    enum: TwoFactorStatus,
    default: TwoFactorStatus.DISABLED,
  })
  twoFactor: TwoFactorStatus;
};