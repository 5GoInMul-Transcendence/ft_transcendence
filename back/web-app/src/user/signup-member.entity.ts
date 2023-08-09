import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('signup_member')
export class SignupMember {
  @PrimaryColumn('varchar', { length: 12 })
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('varchar', { length: 64 })
  password: string;
}