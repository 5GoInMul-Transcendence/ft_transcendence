import { Injectable, OnModuleInit } from '@nestjs/common';
import LinkedList, { Token } from 'fast-linked-list';
import { GameProcessUnit } from '../game-process-unit';
import { ProcessStatus } from './enums/process-status.enum';

@Injectable()
export class GameCore implements OnModuleInit {
  private processList: LinkedList;
  private deleteProcess: Token[];

  constructor() {
    this.processList = new LinkedList();
  }

  onModuleInit(): any {
    setInterval(() => {
      this.processList.forEach(
        (processUnit: GameProcessUnit, tok: Token<GameProcessUnit>) => {
          if (processUnit.playGameByOneFrame() == ProcessStatus.END) {
            this.deleteProcess.push(tok);
          }
        },
      );

      if (this.deleteProcess.length) {
        for (let i = 0; i < this.deleteProcess.length; i++) {
          this.deleteProcess[i].remove();
        }
      }
    }, 16);
  }

  push(processUnit: GameProcessUnit) {
    this.processList.push(processUnit);
  }
}
