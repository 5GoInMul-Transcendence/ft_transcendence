import { ConfigService } from '@nestjs/config';

export const ioClientOption = {
  provide: 'GAME_CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      uri: configService.get('GAME_SERVER_URI'),
    };
  },
};
