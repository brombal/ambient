const clone = require('../src/clone');

test('clones primitive', () => {
  const value = clone('a');
  expect(value).toBe('a');
});

test('clones object', () => {
  const value = { a: 1, b: 2 };
  const cloned = clone(value);
  expect(cloned).toEqual(value);
  expect(cloned).not.toBe(value);
});

test('clones array', () => {
  const value = [1, 2, 3];
  const cloned = clone(value);
  expect(cloned).toEqual(value);
  expect(cloned).not.toBe(value);
});

test('clones array deep', () => {
  const value = [{ a: 1, b: 2 }, 2, 3];
  const cloned = clone(value);
  expect(cloned).toEqual(value);
  expect(cloned).not.toBe(value);
  expect(cloned[0]).not.toBe(value[0]);
});

test('clones object deep', () => {
  const value = { a: 1, b: 2, c: [1, 2, 3] };
  const cloned = clone(value);
  expect(cloned).toEqual(value);
  expect(cloned).not.toBe(value);
  expect(cloned.c).not.toBe(value.c);
});
