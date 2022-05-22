import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

import { playerTypes, playerPositions, computerPositions } from './utils';

export function* characterGenerator(allowedTypes, maxLevel) {
  const index = Math.floor(Math.random() * (allowedTypes.length));
  const indexLevel = Math.floor(Math.random() * (maxLevel)) + 1;

  const character = new allowedTypes[index](1);

  for (let i = 1; i < indexLevel; i += 1) {
    character.levelUp();
  }

  yield character;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();

  function generatePosition(allowedPositions) {
    // eslint-disable-next-line max-len
    let coordinate = allowedPositions[Math.floor(Math.random() * (allowedPositions.length))];
    // eslint-disable-next-line no-loop-func
    while (team.members.filter((item) => item.position === coordinate).length > 0) {
      coordinate = allowedPositions[Math.floor(Math.random() * (allowedPositions.length))];
    }
    return coordinate;
  }

  for (let i = 0; i < characterCount; i += 1) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    let position = generatePosition(computerPositions());

    if (allowedTypes.filter((item, index) => item === playerTypes()[index]).length > 0) {
      position = generatePosition(playerPositions());
    }

    team.add(new PositionedCharacter(character, position));
  }

  return team;
}
