import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ChannelExceptionService {
	/** public */
	notExistChannel() {
		throw new HttpException('채널이 존재하지 않습니다!', HttpStatus.OK);
	}

	notEnterUserInChannel() {
		throw new HttpException('채널에 입장한 상태가 아닙니다.', HttpStatus.UNAUTHORIZED);
	}

	itIsInvalidRequest() {
		throw new HttpException('올바르지 않은 요청입니다.', HttpStatus.OK);
	}

	/** Add channel */
	passwordIsNotValid() {
		throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.OK);
	}

	/** Enter channel */
	youAreBanUser() {
		throw new HttpException('채널에 차단(ban)되었습니다.', HttpStatus.OK);
	}
}
