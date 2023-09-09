import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MainService {
  private webServer: Socket;

  connectMain(client: Socket) {
    this.webServer = client;
  }

  getWebServer() {
    return this.webServer;
  }
}
