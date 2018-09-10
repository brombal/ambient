const applyChanges = require('../src/applyChanges');
const compare = require('../src/compare');

test('compares no changes', () => {
  const state = { a: 1, b: 2 };
  const changes = applyChanges(state, state => null);
  expect(changes).toBe(state);
});

test('compares primitive values', () => {
  const state = { a: 1, b: 2 };
  const changes = applyChanges(state, state => state.a = 3);
  expect(changes).not.toBe(state);
});

test('compares falsey values', () => {
  let a = null;
  let b = null;
  expect(compare(a, b)).toBe(b);

  a = { a: 1 };
  b = null;
  expect(compare(a, b)).toBe(b);

  a = null;
  b = false;
  expect(compare(a, b)).toBe(b);

  a = null;
  b = { a: 1 };
  expect(compare(a, b)).toBe(b);

  a = { a: null };
  b = { a: 1 };
  expect(compare(a, b)).toBe(b);
});

test('compares object values', () => {
  const state = { a: { a1: 1 }, b: { b1: 2 } };
  const changes = applyChanges(state, state => state.b.b1 = 3);
  expect(changes).not.toBe(state);
  expect(changes.a).toBe(state.a);
  expect(changes.b).not.toBe(state.b);
});

test('compares deeper object values', () => {
  const state = {
    a: { a1: 1 },
    b: {
      b1: 2,
      b2: { b3: 4 }
    }
  };
  const changes = applyChanges(state, state => state.b.b1 = 3);
  expect(changes).not.toBe(state);
  expect(changes.a).toBe(state.a);
  expect(changes.a.a1).toBe(state.a.a1);
  expect(changes.b).not.toBe(state.b);
  expect(changes.b.b1).not.toBe(state.b.b1);
  expect(changes.b.b2).toBe(state.b.b2);
});

test('compares array values', () => {
  const state1 = {
    a: [1, 2, 3],
    b: {
      b1: 2,
      b2: [4, 5, 6],
      b3: [4, [5.1, 5.2, 5.3], 6],
      b4: [4, [5.1, 5.2, 5.3], 6],
    }
  };
  const state2 = {
    a: [1, 2, 3],
    b: {
      b1: 2,
      b2: [4, 5, 6],
      b3: [4, [5.1, 5.2, 5.3], 6, 7], // add value
      b4: [4, [5.1, 5.2, 5.3]], // delete value
    }
  };
  const changes = compare(state1, state2);
  expect(changes).not.toBe(state1);
  expect(changes.a).toBe(state1.a);
  expect(changes.b).not.toBe(state1.b);
  expect(changes.b.b1).toBe(state1.b.b1);
  expect(changes.b.b2).toBe(state1.b.b2);
  expect(changes.b.b3).not.toBe(state1.b.b3);
  expect(changes.b.b3[1]).toBe(state1.b.b3[1]);
  expect(changes.b.b3[3]).toBe(7);
  expect(changes.b.b4).not.toBe(state1.b.b4);
  expect(changes.b.b4.length).toBe(2);
  expect(changes.b.b4[1]).toBe(state1.b.b4[1]);
  expect(changes.b.b4[2]).toBeUndefined();
});

test('compares changing object keys', () => {
  const state = {
    a: { a1: 1 },
    b: {
      b1: 2,
      b2: { b21: 3 },
      b3: { b31: { b311: 1 } },
      b4: { b41: { b411: 1 }, b42: 1 },
    }
  };
  const changes = applyChanges(state, state => {
    state.b.b3.b32 = 6;
    delete state.b.b4.b42;
  });
  expect(changes).not.toBe(state);
  expect(changes.a).toBe(state.a);
  expect(changes.b).not.toBe(state.b);
  expect(changes.b.b1).toBe(state.b.b1);
  expect(changes.b.b2).toBe(state.b.b2);
  expect(changes.b.b3).not.toBe(state.b.b3);
  expect(changes.b.b3.b31).toBe(state.b.b3.b31);
  expect(changes.b.b3.b32).not.toBe(state.b.b3.b32);
  expect(changes.b.b4).not.toBe(state.b.b3);
  expect(changes.b.b4.b41).toBe(state.b.b4.b41);
  expect(changes.b.b4.b42).toBeUndefined();
});

