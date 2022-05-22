import themes from './themes';
import cursors from './cursors';

import GamePlay from './GamePlay';
import GameState from './GameState';

import { generateTeam } from './generators';

import {
  playerTypes, computerTypes,
  playerTypesName, computerTypesName,
  playerPositions, computerPositions,
} from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.gameState = new GameState();
    this.stateService = stateService;
  }

  reset() {
    if (this.gameState.selectedPosition !== null) {
      this.gamePlay.deselectCell(this.gameState.selectedPosition);
    }

    this.gameState.characters = [];
    this.gameState.level = 1;
    this.gameState.turnPlayer = true;
    this.gameState.selectedPosition = null;
    this.gameState.selectedCharacter = null;
    this.gameState.selectedCell = null;
    this.gameState.score = 0;

    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  newGame() {
    this.reset();

    const teamPlayer = generateTeam(playerTypes(), this.gameState.level, 2);
    const teamComputer = generateTeam(computerTypes(), this.gameState.level, 2);

    for (let i = 0; i < teamPlayer.members.length; i += 1) {
      this.gameState.characters.push(teamPlayer.members[i]);
      this.gameState.characters.push(teamComputer.members[i]);
    }

    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.characters);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  saveGame() {
    this.stateService.save(this.gameState);
  }

  loadGame() {
    const state = this.stateService.load();
    GameState.from(this.gameState, state);
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.characters);
    if (!this.gameState.turnPlayer) setTimeout(() => this.turnComputer(), 2000);
  }

  gameOver(message) {
    GamePlay.showMessage(message);
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  init() {
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));

    this.gamePlay.drawUi(themes[this.gameState.level]);
  }

  onCellClick(index) {
    const indexCharacter = this.gameState.characters.findIndex((item) => item.position === index);

    if (this.gameState.turnPlayer) {
      if (indexCharacter > -1) {
        if (playerTypesName().includes(this.gameState.characters[indexCharacter].character.type)) {
          if (this.gameState.selectedPosition !== null) {
            this.gamePlay.deselectCell(this.gameState.selectedPosition);
          }
          this.gamePlay.selectCell(index);
          this.gameState.selectedPosition = index;
          this.gameState.selectedCharacter = this.gameState.characters[indexCharacter].character;
        } else if (
          computerTypesName().includes(this.gameState.characters[indexCharacter].character.type)
          && this.gameState.selectedPosition === null
        ) {
          GamePlay.showError('You cannot play this character');
        }

        if (this.gameState.selectedCharacter !== null) {
          if (
            computerTypesName().includes(this.gameState.characters[indexCharacter].character.type)
            && this.availableCells(index).possible
          ) {
            this.attack(index);
            setTimeout(() => this.turnComputer(), 2000);
          }
        }
      }

      if (indexCharacter === -1 && this.gameState.selectedCharacter !== null) {
        if (this.availableCells(index).possible) {
          this.motion(index);
          setTimeout(() => this.turnComputer(), 2000);
        }
      }

      if (this.gamePlay.boardEl.style.cursor === 'not-allowed') GamePlay.showError('Action cannot be performed');
    }
  }

  onCellEnter(index) {
    const indexCharacter = this.gameState.characters.findIndex((item) => item.position === index);

    if (indexCharacter > -1) {
      this.gamePlay.showCellTooltip(`🎖 ${this.gameState.characters[indexCharacter].character.level} ⚔ ${this.gameState.characters[indexCharacter].character.attack} 🛡 ${this.gameState.characters[indexCharacter].character.defence} ❤ ${this.gameState.characters[indexCharacter].character.health}`, index);

      if (
        playerTypesName().includes(this.gameState.characters[indexCharacter].character.type)
        && index !== this.gameState.selectedPosition
      ) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (
        computerTypesName().includes(this.gameState.characters[indexCharacter].character.type)
        && this.gameState.selectedCharacter !== null
      ) {
        if (this.availableCells(index).possible) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.gameState.selectedCell = index;
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }

    if (indexCharacter === -1 && this.gameState.selectedCharacter !== null) {
      if (this.availableCells(index).possible) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
        this.gameState.selectedCell = index;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    const indexCharacter = this.gameState.characters.findIndex((item) => item.position === index);

    this.gamePlay.setCursor(cursors.auto);

    if (this.gameState.selectedCell !== null) {
      this.gamePlay.deselectCell(this.gameState.selectedCell);
    }
    if (indexCharacter > -1) this.gamePlay.hideCellTooltip(index);
  }

  availableCells(index) {
    let x = (this.gameState.selectedPosition + 1) % this.gamePlay.boardSize;
    if (x === 0) x = 8;
    const y = Math.ceil((this.gameState.selectedPosition + 1) / this.gamePlay.boardSize);
    const possibleVersion = [];
    let step = 2;

    function findCoordinate(row, column, boardSize) {
      return ((column - 1) * boardSize + row) - 1;
    }

    if (this.gameState.selectedCharacter.type === 'swordsman' || this.gameState.selectedCharacter.type === 'undead') {
      if (this.gameState.characters.findIndex((item) => item.position === index) > -1) {
        step = 1;
      } else {
        step = 4;
      }
    }

    if (this.gameState.selectedCharacter.type === 'magician' || this.gameState.selectedCharacter.type === 'daemon') {
      if (this.gameState.characters.findIndex((item) => item.position === index) > -1) {
        step = 4;
      } else {
        step = 1;
      }
    }

    if (this.gameState.characters.findIndex((item) => item.position === index) === -1) {
      for (let i = 1; i <= step; i += 1) {
        if (x - i > 0) {
          possibleVersion.push(findCoordinate(x - i, y, this.gamePlay.boardSize));
        }
        if (x + i <= this.gamePlay.boardSize) {
          possibleVersion.push(findCoordinate(x + i, y, this.gamePlay.boardSize));
        }
        if (y - i > 0) {
          possibleVersion.push(findCoordinate(x, y - i, this.gamePlay.boardSize));
        }
        if (y + i <= this.gamePlay.boardSize) {
          possibleVersion.push(findCoordinate(x, y + i, this.gamePlay.boardSize));
        }
        if (x - i > 0 && y - i > 0) {
          possibleVersion.push(findCoordinate(x - i, y - i, this.gamePlay.boardSize));
        }
        if (x + i <= this.gamePlay.boardSize && y - i > 0) {
          possibleVersion.push(findCoordinate(x + i, y - i, this.gamePlay.boardSize));
        }
        if (x + i <= this.gamePlay.boardSize && y + i <= this.gamePlay.boardSize) {
          possibleVersion.push(findCoordinate(x + i, y + i, this.gamePlay.boardSize));
        }
        if (x - i > 0 && y + i <= this.gamePlay.boardSize) {
          possibleVersion.push(findCoordinate(x - i, y + i, this.gamePlay.boardSize));
        }
      }
    } else {
      let top = 0;
      let right = 0;
      let left = 0;
      let bottom = 0;

      for (let i = 1; i <= step; i += 1) {
        if (x - i > 0) left = i;
        if (x + i <= this.gamePlay.boardSize) right = i;
        if (y - i > 0) top = i;
        if (y + i <= this.gamePlay.boardSize) bottom = i;
      }

      for (let j = y - top; j <= y + bottom; j += 1) {
        for (let i = x - left; i <= x + right; i += 1) {
          possibleVersion.push(findCoordinate(i, j, this.gamePlay.boardSize));
        }
      }
    }

    if (possibleVersion.includes(index)) {
      return { array: possibleVersion, possible: true };
    }

    return { array: possibleVersion, possible: false };
  }

  async attack(index) {
    const indexEnemy = this.gameState.characters.findIndex((item) => item.position === index);
    const damage = Math.round(Math.max(
      // eslint-disable-next-line max-len
      this.gameState.selectedCharacter.attack - this.gameState.characters[indexEnemy].character.defence,
      this.gameState.selectedCharacter.attack * 0.1,
    ));
    this.gameState.characters[indexEnemy].character.health -= damage;
    await this.gamePlay.showDamage(index, damage);

    if (this.gameState.characters[indexEnemy].character.health <= 0) {
      this.gameState.characters.splice(indexEnemy, 1);
    }

    if (this.gameState.turnPlayer) {
      // eslint-disable-next-line max-len
      const teamComputer = this.gameState.characters.filter((item) => computerTypesName().includes(item.character.type));
      if (teamComputer.length === 0) {
        this.levelUp();
        this.performAction();
        this.gameState.turnPlayer = true;
        return null;
      }
    }

    if (!this.gameState.turnPlayer) {
      // eslint-disable-next-line max-len
      const teamPlayer = this.gameState.characters.filter((item) => playerTypesName().includes(item.character.type));
      if (teamPlayer.length === 0) {
        this.checkRecord();
        this.gameOver(`Game over: ${this.gameState.score}. Best score: ${this.gameState.record}`);
        this.performAction();
        this.gameState.turnPlayer = true;
        return null;
      }
    }

    this.performAction();
    return null;
  }

  motion(index) {
    // eslint-disable-next-line max-len
    const indexSelected = this.gameState.characters.findIndex((item) => item.position === this.gameState.selectedPosition);
    this.gameState.characters[indexSelected].position = index;

    this.performAction();
  }

  performAction() {
    this.gamePlay.deselectCell(this.gameState.selectedPosition);
    this.gamePlay.deselectCell(this.gameState.selectedCell);

    this.gamePlay.redrawPositions(this.gameState.characters);

    this.gameState.selectedPosition = null;
    this.gameState.selectedCharacter = null;
    this.gameState.selectedCell = null;

    if (this.gameState.turnPlayer) {
      this.gameState.turnPlayer = false;
    } else {
      this.gameState.turnPlayer = true;
    }
  }

  turnComputer() {
    if (!this.gameState.turnPlayer) {
      // eslint-disable-next-line max-len
      const teamComputer = this.gameState.characters.filter((item) => computerTypesName().includes(item.character.type));
      // eslint-disable-next-line max-len
      const teamPlayer = this.gameState.characters.filter((item) => playerTypesName().includes(item.character.type));

      for (let i = 0; i < teamComputer.length; i += 1) {
        this.gameState.selectedPosition = teamComputer[i].position;
        this.gameState.selectedCharacter = teamComputer[i].character;
        for (let j = 0; j < teamPlayer.length; j += 1) {
          if (this.availableCells(teamPlayer[j].position).possible) {
            this.gamePlay.selectCell(teamComputer[i].position);
            this.gamePlay.selectCell(teamPlayer[j].position, 'red');
            this.gameState.selectedCell = teamPlayer[j].position;
            this.attack(teamPlayer[j].position);
            return null;
          }
        }
      }

      for (let i = 0; i < teamPlayer.length; i += 1) {
        this.gameState.selectedPosition = teamPlayer[i].position;
        this.gameState.selectedCharacter = teamPlayer[i].character;
        for (let j = 0; j < teamComputer.length; j += 1) {
          if (this.availableCells(teamComputer[j].position).possible) {
            this.gameState.selectedPosition = teamComputer[j].position;
            this.gameState.selectedCharacter = teamComputer[j].character;

            this.gamePlay.selectCell(teamComputer[j].position);

            const arrayCells = this.availableCells(0).array;

            let index = Math.floor(Math.random() * arrayCells.length);
            while (
              // eslint-disable-next-line no-loop-func
              teamComputer.findIndex((item) => item.position === arrayCells[index]) > -1
              // eslint-disable-next-line no-loop-func
              || teamPlayer.findIndex((item) => item.position === arrayCells[index]) > -1
            ) {
              index = Math.floor(Math.random() * arrayCells.length);
            }

            this.gamePlay.selectCell(arrayCells[index], 'green');
            this.gameState.selectedCell = arrayCells[index];
            this.motion(arrayCells[index]);
            return null;
          }
        }
      }

      const indexCharacter = Math.floor(Math.random() * (teamComputer.length));

      this.gameState.selectedPosition = teamComputer[indexCharacter].position;
      this.gameState.selectedCharacter = teamComputer[indexCharacter].character;
      this.gamePlay.selectCell(teamComputer[indexCharacter].position);

      const arrayCells = this.availableCells(0).array;

      let index = Math.floor(Math.random() * arrayCells.length);
      while (
        // eslint-disable-next-line no-loop-func
        teamComputer.findIndex((item) => item.position === arrayCells[index]) > -1
        // eslint-disable-next-line no-loop-func
        || teamPlayer.findIndex((item) => item.position === arrayCells[index]) > -1
      ) {
        index = Math.floor(Math.random() * arrayCells.length);
      }

      this.gamePlay.selectCell(arrayCells[index], 'green');
      this.gameState.selectedCell = arrayCells[index];

      this.motion(arrayCells[index]);
    }
    return null;
  }

  levelUp() {
    if (this.gameState.level === 4) {
      this.checkRecord();
      this.gameOver(`Win: ${this.gameState.score}. Лучший результат - ${this.gameState.record}`);

      return null;
    }

    this.gameState.level += 1;

    // eslint-disable-next-line max-len
    this.gameState.score += this.gameState.characters.reduce((sum, item) => sum + item.character.health, 0);

    this.checkRecord();
    GamePlay.showMessage(`Level up: ${this.gameState.score}. Best scxore: ${this.gameState.record}`);

    for (let i = 0; i < this.gameState.characters.length; i += 1) {
      this.gameState.characters[i].character.level += 1;

      this.gameState.characters[i].character.attack = Math.round(Math.max(
        this.gameState.characters[i].character.attack,
        // eslint-disable-next-line max-len
        (this.gameState.characters[i].character.attack * (1.8 - (this.gameState.characters[i].character.health * 0.01))),
      ));

      this.gameState.characters[i].character.defence = Math.round(Math.max(
        this.gameState.characters[i].character.defence,
        // eslint-disable-next-line max-len
        (this.gameState.characters[i].character.defence * (1.8 - (this.gameState.characters[i].character.health * 0.01))),
      ));

      this.gameState.characters[i].character.health += 80;
      if (this.gameState.characters[i].character.health > 100) {
        this.gameState.characters[i].character.health = 100;
      }
    }

    if (this.gameState.level === 2) {
      const teamPlayer = generateTeam(playerTypes(), 1, 1);
      teamPlayer.redefiningPosition(this.gameState.characters, playerPositions());
      teamPlayer.members.forEach((item) => this.gameState.characters.push(item));
      const teamComputer = generateTeam(computerTypes(), 2, this.gameState.characters.length);
      teamComputer.redefiningPosition(this.gameState.characters, computerPositions());
      teamComputer.members.forEach((item) => this.gameState.characters.push(item));
    }

    if (this.gameState.level === 3) {
      const teamPlayer = generateTeam(playerTypes(), 2, 2);
      teamPlayer.redefiningPosition(this.gameState.characters, playerPositions());
      teamPlayer.members.forEach((item) => this.gameState.characters.push(item));
      const teamComputer = generateTeam(computerTypes(), 3, this.gameState.characters.length);
      teamComputer.redefiningPosition(this.gameState.characters, computerPositions());
      teamComputer.members.forEach((item) => this.gameState.characters.push(item));
    }

    if (this.gameState.level === 4) {
      const teamPlayer = generateTeam(playerTypes(), 3, 2);
      teamPlayer.redefiningPosition(this.gameState.characters, playerPositions());
      teamPlayer.members.forEach((item) => this.gameState.characters.push(item));
      const teamComputer = generateTeam(computerTypes(), 4, this.gameState.characters.length);
      teamComputer.redefiningPosition(this.gameState.characters, computerPositions());
      teamComputer.members.forEach((item) => this.gameState.characters.push(item));
    }

    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.characters);

    return null;
  }

  checkRecord() {
    if (this.gameState.record < this.gameState.score) this.gameState.record = this.gameState.score;
  }
}
