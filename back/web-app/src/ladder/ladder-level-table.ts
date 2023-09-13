import { Builder } from 'builder-pattern';

class LadderLevel {
  readonly level: number;
  readonly nextLevelPoint: number;
  readonly displayName: string;
}

export const LadderLevelTable = [
  Builder(LadderLevel).displayName('').level(0).nextLevelPoint(0).build(),
  Builder(LadderLevel).displayName('10급').level(1).nextLevelPoint(1).build(),
  Builder(LadderLevel).displayName('9급').level(2).nextLevelPoint(5).build(),
  Builder(LadderLevel).displayName('8급').level(3).nextLevelPoint(10).build(),
  Builder(LadderLevel).displayName('7급').level(4).nextLevelPoint(15).build(),
  Builder(LadderLevel).displayName('6급').level(5).nextLevelPoint(20).build(),
  Builder(LadderLevel).displayName('5급').level(6).nextLevelPoint(30).build(),
  Builder(LadderLevel).displayName('4급').level(7).nextLevelPoint(42).build(),
  Builder(LadderLevel).displayName('3급').level(8).nextLevelPoint(60).build(),
  Builder(LadderLevel).displayName('2급').level(9).nextLevelPoint(90).build(),
  Builder(LadderLevel).displayName('1급').level(10).nextLevelPoint(120).build(),
  Builder(LadderLevel).displayName('1단').level(11).nextLevelPoint(150).build(),
  Builder(LadderLevel).displayName('2단').level(12).nextLevelPoint(180).build(),
  Builder(LadderLevel).displayName('3단').level(13).nextLevelPoint(210).build(),
  Builder(LadderLevel).displayName('4단').level(14).nextLevelPoint(240).build(),
  Builder(LadderLevel).displayName('5단').level(15).nextLevelPoint(270).build(),
  Builder(LadderLevel).displayName('6단').level(16).nextLevelPoint(300).build(),
  Builder(LadderLevel).displayName('7단').level(17).nextLevelPoint(330).build(),
  Builder(LadderLevel).displayName('8단').level(18).nextLevelPoint(360).build(),
  Builder(LadderLevel).displayName('9단').level(19).nextLevelPoint(420).build(),
  Builder(LadderLevel).displayName('10단').level(20).nextLevelPoint(Number.MAX_SAFE_INTEGER).build(),
];
