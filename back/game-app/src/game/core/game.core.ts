import { Injectable, OnModuleInit } from '@nestjs/common';
import LinkedList from 'fast-linked-list';
import { GameProcessUnit } from '../game-process-unit';

@Injectable()
export class GameCore implements OnModuleInit {
  private processList: LinkedList;

  constructor() {
    this.processList = new LinkedList();
  }
  onModuleInit(): any {
    setInterval(() => {
      this.processList.forEach((processUnit, tok) => {});
    }, 16);
  }

  push(processUnit: GameProcessUnit) {
    this.processList.push(processUnit);
  }
}
