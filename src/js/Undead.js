import Character from './Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.type = 'undead';
    this.distance = 4;
    this.distanceAttack = 1;
  }
}
