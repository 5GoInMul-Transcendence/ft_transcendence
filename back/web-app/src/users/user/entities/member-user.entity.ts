import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('member_user')
export class MemberUser {
  @PrimaryColumn('varchar', { length: 12 })
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('varchar', { length: 72 })
  password: string;
}