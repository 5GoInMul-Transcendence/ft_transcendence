import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
	async hashPassword(inputPassword: string): Promise<string> {
		if (inputPassword === null)
			return null;
		const saltRounds = 10; // 솔트 라운드 수, 높을수록 보안 강화
		const hashedPassword = await bcrypt.hash(inputPassword, saltRounds);
		
		return hashedPassword;
	}

	async hashCompare(input: string, origin: string): Promise<boolean> {
		// if (!input || !origin) // 얘 필요하나?
		// 	return true;
    return await bcrypt.compare(
      input,
      origin,
    );
	}
}
