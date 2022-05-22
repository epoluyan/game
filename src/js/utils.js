import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';

import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export function calcTileType(index, boardSize) {
  const number = index + 1;

  if (number === 1) return 'top-left';
  if (number < boardSize) return 'top';
  if (number === boardSize) return 'top-right';

  if (number === boardSize * (boardSize - 1) + 1) return 'bottom-left';
  if (number > boardSize * (boardSize - 1) + 1 && number < boardSize ** 2) return 'bottom';
  if (number === boardSize ** 2) return 'bottom-right';

  if (number % boardSize === 1) return 'left';
  if (number % boardSize === 0) return 'right';

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function playerTypes() {
  return [Bowman, Swordsman, Magician];
}

export function computerTypes() {
  return [Daemon, Undead, Vampire];
}

export function playerTypesName() {
  return ['bowman', 'swordsman', 'magician'];
}

export function computerTypesName() {
  return ['daemon', 'undead', 'vampire'];
}

export function playerPositions(boardSize = 8) {
  const availablePositions = [];

  for (let i = 1; i <= boardSize * (boardSize - 1) + 1; i += boardSize) {
    availablePositions.push(i - 1);
    availablePositions.push(i);
  }

  return availablePositions;
}

export function computerPositions(boardSize = 8) {
  const availablePositions = [];

  for (let i = boardSize; i <= boardSize ** 2; i += boardSize) {
    availablePositions.push(i - 2);
    availablePositions.push(i - 1);
  }

  return availablePositions;
}
