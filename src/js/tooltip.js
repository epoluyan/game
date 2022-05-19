export default function tooltip(item) {
  const level = String.fromCodePoint(0x1F396);
  const attack = String.fromCodePoint(0x2694);
  const defence = String.fromCodePoint(0x1F6E1);
  const health = String.fromCodePoint(0x2764);
  return `${level}${item.level} ${attack}${item.attack} ${defence}${item.defence} ${health}${item.health}`;
}
