import { Injectable } from "@nestjs/common";
import { GetChannelInformationResDto } from "./dto/get-channel-information-res.dto";
import { LinkChannelToUser } from "./entities/link-channel-to-user.entity";
import { Builder } from "builder-pattern";

@Injectable()
export class ChannelSettingService {
	getChannelInformation(linksInChannel: LinkChannelToUser[]): GetChannelInformationResDto[] {
		const information: GetChannelInformationResDto[] = [];

		linksInChannel.forEach((link) => {
			information.push(
				Builder(GetChannelInformationResDto)
				.avatar(link.user.avatar)
				.id(link.user.id)
				.nickname(link.user.nickname)
				.role(link.role)
				.build()
			);
		})
		return information;
	}
}