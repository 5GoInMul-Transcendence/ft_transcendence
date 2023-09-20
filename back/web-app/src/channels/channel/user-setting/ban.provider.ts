import { Injectable } from "@nestjs/common";

@Injectable()
export class BanProvider extends Map<number, Set<number>> {
	/**
	 * key: channelId
	 * value: userId list set
	 */
	constructor() {
		super();
	}
}