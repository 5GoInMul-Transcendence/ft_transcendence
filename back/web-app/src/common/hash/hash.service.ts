import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
	private readonly saltRounds = 10; // 솔트 라운드 수, 높을수록 보안 강화

	async hashPassword(inputPassword: string): Promise<string | null> {
		if (inputPassword === null)
			return null;
		const hashedPassword = await bcrypt.hash(inputPassword, this.saltRounds);
		
		return hashedPassword;
	}

	/**
	 * 
	 * @param input: null 이 되면 안 됨
	 * @param origin: null 이 되면 안 됨
	 * @returns 
	 */
	async hashCompare(input: string, origin: string): Promise<boolean> {
		// if (!origin)
		// 	return true;
    return await bcrypt.compare(
      input,
      origin,
    );
	}
}
