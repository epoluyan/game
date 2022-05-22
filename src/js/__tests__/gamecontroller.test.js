import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';
import Vampire from '../characters/Vampire';

test('Отображение подсказки с информацией о персонаже', () => {
  const bowman = new Bowman(1);

  const received = `🎖 ${bowman.level} ⚔ ${bowman.attack} 🛡 ${bowman.defence} ❤ ${bowman.health}`;
  const expected = `🎖 ${bowman.level} ⚔ ${bowman.attack} 🛡 ${bowman.defence} ❤ ${bowman.health}`;

  expect(received).toBe(expected);
});

test('should display information about the character', () => {
  const gamePlay = new GamePlay();
  const gameCtrl = new GameController(gamePlay, null);

  gameCtrl.gameState.characters.push({ character: new Bowman(1), position: 25 });
  gameCtrl.gameState.selectedCharacter = gameCtrl.gameState.characters[0].character;
  gameCtrl.gameState.selectedPosition = gameCtrl.gameState.characters[0].position;

  const received = gameCtrl.availableCells(9).possible;
  const expected = true;

  expect(received).toBe(expected);
});

test('the player is not allowed to move', () => {
  const gamePlay = new GamePlay();
  const gameCtrl = new GameController(gamePlay, null);

  gameCtrl.gameState.characters.push({ character: new Bowman(1), position: 25 });

  gameCtrl.gameState.selectedCharacter = gameCtrl.gameState.characters[0].character;
  gameCtrl.gameState.selectedPosition = gameCtrl.gameState.characters[0].position;

  const received = gameCtrl.availableCells(10).possible;
  const expected = false;

  expect(received).toBe(expected);
});

test('the player can attack', () => {
  const gamePlay = new GamePlay();
  const gameCtrl = new GameController(gamePlay, null);

  gameCtrl.gameState.characters.push({ character: new Swordsman(1), position: 25 });
  gameCtrl.gameState.characters.push({ character: new Vampire(1), position: 26 });

  gameCtrl.gameState.selectedCharacter = gameCtrl.gameState.characters[0].character;
  gameCtrl.gameState.selectedPosition = gameCtrl.gameState.characters[0].position;

  const received = gameCtrl.availableCells(26).possible;
  const expected = true;

  expect(received).toBe(expected);
});

test('the player can`t attack', () => {
  const gamePlay = new GamePlay();
  const gameCtrl = new GameController(gamePlay, null);

  gameCtrl.gameState.characters.push({ character: new Swordsman(1), position: 25 });
  gameCtrl.gameState.characters.push({ character: new Vampire(1), position: 62 });

  gameCtrl.gameState.selectedCharacter = gameCtrl.gameState.characters[0].character;
  gameCtrl.gameState.selectedPosition = gameCtrl.gameState.characters[0].position;

  const received = gameCtrl.availableCells(62).possible;
  const expected = false;

  expect(received).toBe(expected);
});

test('should return error', () => {
  const stateService = new GameStateService();

  function loadGame() {
    stateService.load();
  }

  expect(loadGame).toThrowError('Error state game');
});
