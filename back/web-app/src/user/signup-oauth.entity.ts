import { ServiceProvider } from "src/service-provider.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('signup_oauth')
export class SignupOauth {
  @PrimaryColumn()
  id: number; // oauth 로부터 받는 id

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ServiceProvider,
    default: ServiceProvider.FT,
  })
  service_provider: ServiceProvider;
}