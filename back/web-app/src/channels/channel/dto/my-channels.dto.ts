import { RecentMessage } from "./recent-message.dto";

export class MyChannels {
	readonly id: number;
	readonly name: string;
	readonly recentMessage: RecentMessage;
}