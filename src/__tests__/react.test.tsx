import * as React from 'react';
import Ambient from '../ambient';
import AmbientSubscriber, { withAmbient } from '../ambient-react';
import * as renderer from 'react-test-renderer';


test('content changes when ambient state is updated', () => {
  const store = new Ambient({ value: 'abc' });
  const component = renderer.create(
    <AmbientSubscriber store={store}>
      {state => `value: ${state.value}`}
    </AmbientSubscriber>
  );

  let tree = component.toJSON();
  expect(tree).toBe('value: abc');

  store.update(state => { state.value = 'def'; });

  tree = component.toJSON();
  expect(tree).toBe('value: def');
});

test('content only updates when checker passes', () => {
  const store = new Ambient({ a: 1, b: 1 });
  const component = renderer.create(
    <AmbientSubscriber store={store} on={state => state.a}>
      {state => `value: ${state.b}`}
    </AmbientSubscriber>
  );

  let tree = component.toJSON();
  expect(tree).toBe('value: 1');

  store.update(state => { state.b = 2; });

  tree = component.toJSON();
  expect(tree).toBe('value: 1');

  store.update(state => { state.a = 2; });

  tree = component.toJSON();
  expect(tree).toBe('value: 2');

  component.unmount();
});

test('HOC', () => {
  const store = new Ambient({ a: 1, b: 2 });

  const mockFn = jest.fn();

  const MyAmbientListener = withAmbient(store, state => state.a)(
    class MyComponent extends React.Component<any> {
      componentDidUpdate = mockFn;

      render() {
        return (
          <span>
            {this.props.ambient.a}
            {this.props.ambient.b}
            {this.props.foo}
          </span>
        );
      }
    }
  );

  const component = renderer.create(
    <MyAmbientListener foo="bar">
      {state => `value: ${state.b}`}
    </MyAmbientListener>
  );

  expect(mockFn).toHaveBeenCalledTimes(0);

  let tree = component.toJSON();
  expect(tree.children[0]).toBe('1');
  expect(tree.children[1]).toBe('2');
  expect(tree.children[2]).toBe('bar');

  store.update(state => { state.a = 3; });

  expect(mockFn).toHaveBeenCalledTimes(1);

  tree = component.toJSON();
  expect(tree.children[0]).toBe('3');
  expect(tree.children[1]).toBe('2');
  expect(tree.children[2]).toBe('bar');

  store.update(state => { state.b = 4; }); // doesn't update component

  expect(mockFn).toHaveBeenCalledTimes(1);

  tree = component.toJSON();
  expect(tree.children[0]).toBe('3');
  expect(tree.children[1]).toBe('2');
  expect(tree.children[2]).toBe('bar');
});
