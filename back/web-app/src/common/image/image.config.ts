import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

const IMAGE_MAX_SIZE = 10485760; // 10MB
const IMAGE_UPLOAD_PATH = 'public/avatar';

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    // 이미지 형식은 jpg, jpeg, png만 허용합니다.
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(
        new HttpException('지원하지 않는 이미지 형식입니다.', HttpStatus.OK),
        false,
      );
    }

    // 이미지 사이즈는 10MB까지 허용합니다.
    if (file.size > IMAGE_MAX_SIZE) {
      callback(
        new HttpException(
          '파일당 10MB까지 업로드 할 수 있습니다.',
          HttpStatus.OK,
        ),
        false,
      );
    }

    callback(null, true);
  },

  storage: diskStorage({
    // 이미지 저장 경로를 설정합니다.
    destination: (request, file, callback) => {
      if (!fs.existsSync(IMAGE_UPLOAD_PATH)) {
        fs.mkdirSync(IMAGE_UPLOAD_PATH, { recursive: true });
      }

      callback(null, IMAGE_UPLOAD_PATH);
    },

    // 이미지 파일 이름을 설정합니다.
    filename: (request, file, callback) => {
      const session: Record<string, any> = request.session;

      callback(null, session.userId.toString());
    },
  }),
};
