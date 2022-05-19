import { calcTileType, calcHealthLevel } from '../utils';

test('should return tile type: top-left', () => {
  const received = calcTileType(0, 8);
  expect(received).toEqual('top-left');
});

test('should return tile type: top', () => {
  const received = calcTileType(5, 8);
  expect(received).toEqual('top');
});

test('should return tile type: top-right', () => {
  const received = calcTileType(7, 8);
  expect(received).toEqual('top-right');
});

test('should return tile type: left', () => {
  const received = calcTileType(16, 8);
  expect(received).toEqual('left');
});

test('should return tile type: center', () => {
  const expected = 'center';
  const received = calcTileType(18, 8);
  expect(received).toEqual(expected);
});

test('should return tile type: right', () => {
  const received = calcTileType(23, 8);
  expect(received).toEqual('right');
});

test('should return tile type: bottom-left', () => {
  const received = calcTileType(56, 8);
  expect(received).toEqual('bottom-left');
});

test('should return tile type: bottom', () => {
  const received = calcTileType(60, 8);
  expect(received).toEqual('bottom');
});

test('should return tile type: bottom-right', () => {
  const received = calcTileType(63, 8);
  expect(received).toEqual('bottom-right');
});

test('should return critical health', () => {
  const received = calcHealthLevel(14);
  expect(received).toEqual('critical');
});

test('should return normal health', () => {
  const received = calcHealthLevel(15);
  expect(received).toEqual('normal');
});

test('should return normal health', () => {
  const received = calcHealthLevel(49);
  expect(received).toEqual('normal');
});

test('should return high health', () => {
  const received = calcHealthLevel(50);
  expect(received).toEqual('high');
});
