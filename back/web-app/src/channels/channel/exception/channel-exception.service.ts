import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ChannelExceptionService {
	/** public */
	notExistChannel() {
		throw new HttpException('채널이 존재하지 않습니다!', HttpStatus.BAD_REQUEST);
	}

	notEnterUserInChannel() {
		throw new HttpException('채널에 입장한 상태가 아닙니다.', HttpStatus.UNAUTHORIZED);
	}

	itIsInvalidRequest() {
		throw new HttpException('올바르지 않은 요청입니다.', HttpStatus.BAD_REQUEST);
	}

	/** Add channel */
	passwordIsNotValid() {
		throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
	}

	/** Enter channel */
	youAreBanUser() {
		throw new HttpException('채널에 차단(ban)되었습니다.', HttpStatus.BAD_REQUEST);
	}

	/** Channel setting */
	itIsNotOwner() {
		throw new HttpException('채널 Owner가 아닙니다.', HttpStatus.BAD_REQUEST);
	}

	itIsNotAdmin() {
		throw new HttpException('채널 관리자 권한이 없습니다.', HttpStatus.BAD_REQUEST)
	}
	
	iWasBlocked() {
		throw new HttpException('당신은 상대방으로부터 Block 되었습니다. 참회하세요!', HttpStatus.BAD_REQUEST);
	}
	
	iBlockedHim() {
		throw new HttpException('Block했던 유저입니다.', HttpStatus.BAD_REQUEST);
	}
}
