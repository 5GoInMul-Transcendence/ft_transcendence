import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor() {
    this.sessions = new Map<number, string>();
  }
  private sessions: Map<number, string>;

  isDifferentSessionId(userId: number, sessionId: string): boolean {
    const currentSessionId: string = this.sessions.get(userId);

    return !(currentSessionId === sessionId);
  }

  setSession(session: any, userId: number) {
    // 유효성 검사 필요
    const sessionId = session.id;

    session.userId = userId;
    //test
    console.log('SessionService session service', session?.id);
    this.sessions.set(userId, sessionId);
  }
}
