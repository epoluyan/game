/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const i = Math.floor(Math.random() * allowedTypes.length);
    const level = Math.ceil(Math.random() * maxLevel);

    yield { character: new allowedTypes[i](level), level };
  }
}

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

export function generateTeam(allowedTypes, maxLevel, characterCount, moreFury = false) {
  const newHero = characterGenerator(allowedTypes, maxLevel);
  const team = [];

  for (let i = 0; i < characterCount; i++) {
    const newbie = newHero.next().value;
    if (moreFury && newbie.level !== 1) {
      newbie.character.attack += 5 * (newbie.level - 1);
      newbie.character.defence += 5 * (newbie.level - 1);
    }
    team.push(newbie.character);
  }
  return team;
}
