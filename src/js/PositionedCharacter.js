import Character from './Character';

export default class PositionedCharacter {
  constructor(character, side, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.side = side;
    this.position = position;
  }
}
