export default class Team {
  constructor() {
    this.members = [];
  }

  add(object) {
    this.members.push(object);
  }

  redefiningPosition(oldCharacters, allowedPositions) {
    for (let i = 0; i < this.members.length; i += 1) {
      if (oldCharacters.filter((item) => item.position === this.members[i].position).length > 0) {
        let coordinate = allowedPositions[Math.floor(Math.random() * (allowedPositions.length))];
        while (
          // eslint-disable-next-line no-loop-func
          this.members.filter((item) => item.position === coordinate).length > 0
          // eslint-disable-next-line no-loop-func
          || oldCharacters.filter((item) => item.position === coordinate).length > 0
        ) {
          coordinate = allowedPositions[Math.floor(Math.random() * (allowedPositions.length))];
        }
        this.members[i].position = coordinate;
      }
    }
  }
}
