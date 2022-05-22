export default class GameState {
  constructor() {
    this.characters = [];
    this.level = 1;
    this.turnPlayer = true;
    this.selectedPosition = null;
    this.selectedCharacter = null;
    this.selectedCell = null;
    this.score = 0;
    this.record = 0;
  }

  static from(objectState, object) {
    for (const key in objectState) {
      if (Object.prototype.hasOwnProperty.call(objectState, key)) {
        // eslint-disable-next-line no-param-reassign
        objectState[key] = object[key];
      }
    }

    return null;
  }
}
