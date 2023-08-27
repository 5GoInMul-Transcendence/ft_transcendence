import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { FindUserByNicknameDto } from 'src/users/memoryuser/dto/find-user-by-nickname.dto';
import { GetUserByNicknameDto } from 'src/users/memoryuser/dto/get-user-by-nickname.dto';
import { MemoryUser } from 'src/users/memoryuser/memory-user';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';

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

		while (1) {
			nickname = 'user' + this.generateRandomNickname(randomStrlen);
			memoryUser = this.memoryUserService.getUserByNickname(Builder(GetUserByNicknameDto).nickname(nickname).build())
			if (!memoryUser)
				break;
		}
		return nickname;
	}
}
