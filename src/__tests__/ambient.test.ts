import Ambient from '../ambient';

test('initial state', () => {
  const ambient1 = new Ambient();
  expect(ambient1.get()).toEqual({});

  const ambient2 = new Ambient({ a: 1 });
  expect(ambient2.get().a).toBe(1);
});

test('updater', () => {
  const ambient = new Ambient({ a: 1 });
  ambient.update(state => {
    state.a = 2;
  });
  expect(ambient.get().a).toBe(2);
});

test('subscribe & unsubscribe', () => {
  const ambient = new Ambient({ a: 1 });
  const subscription = jest.fn();
  ambient.subscribe(subscription);
  ambient.update(state => {
    state.a = 2;
  });
  expect(subscription).toHaveBeenCalledTimes(1);

  ambient.update(state => {
    state.a = 2;
  });
  expect(subscription).toHaveBeenCalledTimes(1);

  ambient.update(state => {
    state.a = 3;
  }, true);
  expect(subscription).toHaveBeenCalledTimes(1);

  ambient.unsubscribe(subscription);
  ambient.update(state => {
    state.a = 4;
  });
  expect(subscription).toHaveBeenCalledTimes(1);
});

test('reset', () => {
  const ambient = new Ambient({ a: 1 });
  ambient.update(state => {
    state.a = 2;
  });
  expect(ambient.get()).toEqual({ a: 2 });
  ambient.reset();
  expect(ambient.get()).toEqual({ a: 1 });
});

test('deep subscription', () => {
  const ambient = new Ambient({ a: { a1: 1 }, b: { b1: 1 }, c: [1, 2, 3] } as any);
  const subscriptionB = jest.fn();
  const subscriptionB1 = jest.fn();
  const subscriptionC = jest.fn();
  ambient.subscribe(subscriptionB, state => state.b);
  ambient.subscribe(subscriptionB1, state => state.b.b1);
  ambient.subscribe(subscriptionC, state => state.c);

  ambient.update(state => { state.a = 2; });
  expect(subscriptionB).not.toHaveBeenCalled();
  expect(subscriptionB1).not.toHaveBeenCalled();
  expect(subscriptionC).not.toHaveBeenCalled();

  ambient.update(state => { state.b.b2 = 2; });
  expect(subscriptionB).toHaveBeenCalledTimes(1);
  expect(subscriptionB1).not.toHaveBeenCalled();
  expect(subscriptionC).not.toHaveBeenCalled();

  ambient.update(state => { state.b.b1 = 2; });
  expect(subscriptionB).toHaveBeenCalledTimes(2);
  expect(subscriptionB1).toHaveBeenCalledTimes(1);
  expect(subscriptionC).not.toHaveBeenCalled();

  ambient.update(state => { state.c.push(4); });
  expect(subscriptionB).toHaveBeenCalledTimes(2);
  expect(subscriptionB1).toHaveBeenCalledTimes(1);
  expect(subscriptionC).toHaveBeenCalledTimes(1);
});

test('awaiter', (done) => {
  const ambient = new Ambient({ a: 1 });
  ambient.awaiter(state => state.a === 3 ? true : undefined, state => state.a)
    .then(() => {
      done();
    });
  ambient.update(state => {
    state.a = 2;
  });
  ambient.update(state => {
    state.a = 3;
  });
});