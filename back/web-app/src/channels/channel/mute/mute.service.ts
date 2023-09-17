import { Injectable } from "@nestjs/common";
import { MuteProvider } from "./mute.provider";
import { ChannelExceptionService } from "../exception/channel-exception.service";

@Injectable()
export class MuteService {
	constructor(
		private muteMap: MuteProvider,
	) {}

	isMutedUser(channelId: number, userId: number): boolean {
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
	}

	deleteMutedUser(channelId: number, userId: number): void {
		this.muteMap.get(channelId).delete(userId);
	}
}