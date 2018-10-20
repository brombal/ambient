const React = require('react');
const Ambient = require('../src/index');
require('../src/react');
const renderer = require('react-test-renderer');

test('content changes when ambient state is updated', () => {
  const store = new Ambient({ value: 'abc' });
  const component = renderer.create(React.createElement(Ambient.Subscribe, { store }, state => `value: ${state.value}`));

  let tree = component.toJSON();
  expect(tree).toBe('value: abc');

  store.update(state => { state.value = 'def'; });

  tree = component.toJSON();
  expect(tree).toBe('value: def');
});

test('content only updates when checker passes', () => {
  const store = new Ambient({ a: 1, b: 1 });
  const component = renderer.create(React.createElement(Ambient.Subscribe, { store, on: state => state.a }, state => `value: ${state.b}`));

  let tree = component.toJSON();
  expect(tree).toBe('value: 1');

  store.update(state => { state.b = 2; });

  tree = component.toJSON();
  expect(tree).toBe('value: 1');

  store.update(state => { state.a = 2; });

  tree = component.toJSON();
  expect(tree).toBe('value: 2');
});
