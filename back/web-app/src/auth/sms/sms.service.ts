import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { generateRandomCode } from "../auth.helper";

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
    ) {}
    
    // 인증 메시지 전송
    async sendSMS(phoneNumber: string):Promise<string> {
        // HTTP.Header 정의
        const timestamp: string = Date.now().toString();
        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': this.config.get('NCP_ACCESS_KEY'),
                'x-ncp-apigw-timestamp': timestamp,
                'x-ncp-apigw-signature-v2': this.makeSignature(timestamp),
            },
        }
        
        // HTTP.Body 정의
        const code = generateRandomCode();
        const body = {
            type: 'SMS', // 메시지 포맷 타입 {'SMS', 'LMS', 'MMS'}
            contentType: 'COMM', // 메시지 구분 {'COMM':'일반용, 'AD':'광고용'}
            countryCode: '82', // 국가 코드
            from: this.config.get('NCP_API_CALLING_NUMBER'), // 발신 번호
            content: `[Pong] 인증번호: ${code}\n인증번호를 입력해 주세요.`, // 전송할 메시지
            messages: [{ to: phoneNumber }], // 수신 번호 리스트
        }
        
        // HTTP 전송
        const url:string = this.config.get('NCP_API_URL');
        const value = await firstValueFrom(
            this.httpService.post(url, body, requestConfig).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response.data);
                    throw new HttpException("다시 시도 바랍니다.", HttpStatus.SERVICE_UNAVAILABLE);
                }),
            )
        )
        
        return code;
    }
    
    // NCP API 요청에 필요한 해시값
    private makeSignature(timestamp:string): string {
        const hmac: crypto.Hmac = crypto.createHmac('sha256', this.config.get('NCP_SECRET_KEY'));
        const space = ' ';
        const newLine = '\n';
        const method = 'POST';
        
        hmac.update(method);
        hmac.update(space);
        hmac.update(this.config.get('NCP_API_URI'));
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(this.config.get('NCP_ACCESS_KEY'));
        
        return hmac.digest('base64').toString();
    }
}
