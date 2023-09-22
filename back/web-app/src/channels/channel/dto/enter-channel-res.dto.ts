import { RecentMessageAtEnter } from "./recent-message-at-enter.dto";

export class EnterChannelRes {
	readonly id: number;
	readonly name: string;
	readonly role: string;
	readonly mode: string;
	readonly recentMessage: RecentMessageAtEnter[];
};