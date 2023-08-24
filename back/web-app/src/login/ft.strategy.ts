import { PassportStrategy } from '@nestjs/passport';
import { Strategy, verify } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {

  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FT_UID'),
      clientSecret: configService.get<string>('FT_SECRET'),
      callbackURL: configService.get<string>('FT_REDIRECT'),
      profileFields: {
        'id': function (obj) { return String(obj.id); }, // profileId in OauthUser table
        'emails.0.value': 'email',
      },
    });
  }

  /**
   * Need to find about refreshToken in validate function.
   * @param accessToken 
   * @param refreshToken 
   * @param profile 
   * @param cb 
   */
  async validate(accessToken: string, refreshToken: string, profile: any, cb: verify) {
    const {id, emails} = profile;
    const user = {
      id: id,
      mail: emails[0].value,
    };

    cb(null, user);
  }
}
