import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('message')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 12 })
	nickname: string;

	@Column('varchar', { length: 255 })
	content: string;

	@CreateDateColumn({
		type: 'timestamp',										// db에 저장될 데이터 형식
		precision: 6,													// 10^6 은 micro second
		default: () => 'CURRENT_TIMESTAMP(6)', // 자동으로 micro sec 단위로 현재 시간 저장
	})
	timestamp: Date;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;
}

/** 현재 시간 마이크로 초로 설정 및 복원하는 과정

const microSeconds = new Date().getTime() * 1000;

console.log(`2023년 9월 3일 오전 4시 6분을 마이크로초로 변환한 값: ${microSeconds} 마이크로초`);

// 마이크로초 값을 밀리초로 변환
const milliseconds = microSeconds / 1000;

// 밀리초 값을 사용하여 Date 객체로 변환
const originDate = new Date(milliseconds);

console.log(`마이크로초로 저장된 값을 Date 객체로 변환한 결과: ${originDate}`);

 */