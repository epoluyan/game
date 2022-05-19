import Character from './Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.type = 'vampire';
    this.distance = 2;
    this.distanceAttack = 2;
  }
}
