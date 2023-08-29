import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { FindUserByNicknameDto } from 'src/users/memoryuser/dto/find-user-by-nickname.dto';
import { GetUserByNicknameDto } from 'src/users/memoryuser/dto/get-user-by-nickname.dto';
import { MemoryUser } from 'src/users/memoryuser/memory-user';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupService {
	constructor(
		private memoryUserService: MemoryUserService,
	) {}

	private generateRandomNickname(length: number): string {
		const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let result = "";
	
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length); // Length is 62
			const randomChar = charset.charAt(randomIndex);

			result += randomChar;
		}
		return result;
	}

  getRandomNickname(): string {
		let nickname: string;
		let memoryUser: MemoryUser;
		const randomStrlen = 8;
		const preStr = 'user';

		while (1) {
			nickname = preStr + this.generateRandomNickname(randomStrlen);
			memoryUser = this.memoryUserService.getUserByNickname(Builder(GetUserByNicknameDto).nickname(nickname).build())
			if (!memoryUser)
				break;
		}
		return nickname;
	}

	async hashMemberPassword(userInputPassword: string): Promise<string> {
		const saltRounds = 10; // 솔트 라운드 수, 높을수록 보안 강화
		const hashedPassword = await bcrypt.hash(userInputPassword, saltRounds);
		
		return hashedPassword;
	}
}
