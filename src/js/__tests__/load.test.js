import GameStateService from '../GameStateService';

jest.mock('../GameStateService');
beforeEach(() => {
  jest.resetAllMocks();
});

test('should load game', () => {
  const stateService = new GameStateService();

  const expected = {
    characters: [],
    level: 1,
    turnPlayer: true,
    selectedPosition: null,
    selectedCharacter: null,
    selectedCell: null,
    score: 0,
    record: 0,
  };
  stateService.load.mockReturnValue(expected);
  const received = stateService.load();

  expect(received).toEqual(expected);
});
