import { AchievementElement } from './achievement-element';

export class AchievementTable {
  readonly entityProperty: string;
  readonly elements: AchievementElement[];

  constructor(entityProperty, elements) {
    this.entityProperty = entityProperty;
    this.elements = elements;
  }
}
