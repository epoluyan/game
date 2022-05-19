import Character from '../Character';

test('Trying to create a Character', () => {
  expect(() => new Character()).toThrow('Error, class Character cannot create');
});
