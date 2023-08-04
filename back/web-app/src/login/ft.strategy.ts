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
        'id': function (obj) { return String(obj.id); }, // oauth 데이터베이스에 들어갈 id 는 이거다.
        'username': 'login',
        'displayName': 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image.link'
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
    const {id, name, emails, photos} = profile;
    const user = {
      id: id,
      mail: emails[0].value,
      avatarId: photos[0].value,
      // accessToken
    };

    cb(null, user);
  }
}
