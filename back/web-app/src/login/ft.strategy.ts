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
        'id': function (obj) { return String(obj.id); },
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

  async validate(accessToken: string, refreshToken: string, profile: any, cb: verify): Promise<any> {
    const {name, emails, photos} = profile;
    const user = {
      email: emails[0].value,
      firstName: name.familyName,
      lastName: name.givenName,
      picture: photos[0].value,
      accessToken
    };

    cb(null, user);
  }
}
