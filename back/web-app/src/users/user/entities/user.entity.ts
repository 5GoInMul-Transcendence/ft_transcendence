import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TwoFactorStatus } from "../../enums/twoFactor-status.enum";
import { LinkChannelToUser } from "src/channels/channel/entities/link-channel-to-user.entity";
import { Message } from "src/message/entities/message.entity";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 12 })
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

  @OneToMany(() => LinkChannelToUser, (link) => link.user)
  links: LinkChannelToUser[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
};