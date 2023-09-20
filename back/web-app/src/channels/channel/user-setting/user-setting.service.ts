import { Injectable } from "@nestjs/common";
import { MuteProvider } from "./mute.provider";
import { BanProvider } from "./ban.provider";
import { IsMutedUserReqDto } from "../dto/is-muted-user-req.dto";

@Injectable()
export class UserSettingService {
	constructor(
		private muteMap: MuteProvider,
		private banMap: BanProvider,
	) {}

	public readonly MUTE_SECOND = 60;
	public readonly BAN_SECOND = 60;

	/** Mute */
	isMutedUser(dto: IsMutedUserReqDto): boolean {
		const {channelId,userId} = dto;
		const userSet: Set<number> = this.muteMap.get(channelId);

		if (!userSet)
			return false;
		return userSet.has(userId);
	}

	addMutedUser(channelId: number, userId: number): void {
		if (!this.muteMap.has(channelId)) {
			this.muteMap.set(channelId, new Set<number>())
		}
		this.muteMap.get(channelId).add(userId);

		setTimeout(() => {
			this.deleteMutedUser(channelId, userId);
		}, this.MUTE_SECOND * 1000)
	}

	deleteMutedUser(channelId: number, userId: number): void {
		this.muteMap.get(channelId).delete(userId);
	}

	/** Ban */
	isBanUser(channelId: number, userId: number): boolean {
		const userSet: Set<number> = this.banMap.get(channelId);

		if (!userSet)
			return false;
		return userSet.has(userId);
	}

	addBanUser(channelId: number, userId: number): void {
		if (!this.banMap.has(channelId)) {
			this.banMap.set(channelId, new Set<number>())
		}
		this.banMap.get(channelId).add(userId);
		
		setTimeout(() => {
			this.deleteBanUser(channelId, userId);
		}, this.BAN_SECOND * 1000)
	}

	deleteBanUser(channelId: number, userId: number): void {
		this.banMap.get(channelId).delete(userId);
	}
}