import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TwoFactorStatus } from "./twoFactor-status.enum";

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 36 })
  nickname: string;
  
  @Column('varchar', { length: 64 })
  avatar: string;

  @Column('varchar', { 
    length: 320,
    default: null
  })
  mail: string;

  @Column('varchar', {
    length: 11,
    default: null
  })
  phone: string;
  
  @Column({
    type: 'enum',
    enum: TwoFactorStatus,
    default: TwoFactorStatus.DISABLED,
  })
  twoFactor: TwoFactorStatus;
};