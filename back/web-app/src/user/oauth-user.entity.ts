import { ServiceProvider } from "src/user/service-provider.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('oauth_user')
export class OauthUser {
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

  @Column( {name: 'profile_id'} )
  profileId: number; // oauth 로부터 받는 id
};