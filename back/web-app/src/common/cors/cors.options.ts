import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: process.env.FRONT_URI,
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
};
