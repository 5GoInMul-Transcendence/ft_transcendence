import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSettingService } from '../user-setting/user-setting.service';

@Injectable()
export class ChannelExceptionService {
	constructor(
		private userSettingService: UserSettingService,
	) {}
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

	/** Channel setting */
	itIsNotOwner() {
		throw new HttpException('채널 소유자 권한이 없습니다.', HttpStatus.BAD_REQUEST);
	}

	itIsNotAdmin() {
		throw new HttpException('채널 관리자 권한이 없습니다.', HttpStatus.BAD_REQUEST);
	}

	sameUser() {
		throw new HttpException('자신에게 적용시킬 수 없습니다.', HttpStatus.BAD_REQUEST);
	}

	/** User setting in channel */
	youAreMute() {
		throw new HttpException(`${this.userSettingService.MUTE_SECOND} 초 동안 메시지를 입력할 수 없습니다!`, HttpStatus.BAD_REQUEST);
	}
	youAreBan() {
		throw new HttpException(`${this.userSettingService.BAN_SECOND} 초 동안 채널에 입장할 수 없습니다!`, HttpStatus.BAD_REQUEST);
	}
}
