export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;

    if (new.target.name === 'Character') {
      throw new Error('Error, class Character cannot create');
    }
  }

  levelUp() {
    this.level += 1;

    this.attack = Math.round(Math.max(this.attack, (this.attack * (1.8 - this.health * 0.01))));
    this.defence = Math.round(Math.max(this.defence, (this.defence * (1.8 - this.health * 0.01))));

    this.health += 80;
    if (this.health > 100) this.health = 100;
  }
}
