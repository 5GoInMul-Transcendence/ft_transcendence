import { ServiceProvider } from "src/service-provider.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('signup_oauth')
export class SignupOauth {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ServiceProvider,
    default: ServiceProvider.FT,
  })
  service_provider: ServiceProvider;

  @Column()
  profile_id: number; // oauth 로부터 받는 id
};