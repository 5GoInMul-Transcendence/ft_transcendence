import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {

  constructor(configService: ConfigService) {
    super({
      // authorizationURL: `https://api.intra.42.fr/oauth/authorize?client_id=${configService.get<string>(
      //   'FT_UID',
      // )}&redirect_uri=${configService.get<string>(
      //   'FT_REDIRECT',
      // )}&response_type=code`,
      // tokenURL: 'https://api.intra.42.fr/oauth/token',
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
        'photos.0.value': 'image_url'
      },
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, cb: any) {
    try {
      console.log('accessToken: ', accessToken);
      console.log('refreshToken: ', refreshToken);
      // console.log('profile: ', profile);
      return accessToken;
    } catch (error) {
      console.log(error);
    }
    cb(null, profile);
  }
}
