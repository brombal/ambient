const compare = require('./compare');
const applyChanges = require('./applyChanges');

module.exports = class Ambient {
  constructor(initialState = {}) {
    this.listeners = [];
    this.initialState = initialState;
    this.currentState = initialState;
  }

  get state() {
    return this.currentState;
  }

  set(nextState, quiet = false) {
    const prevState = this.currentState;
    this.currentState = nextState;
    if (!quiet) {
      this.listeners.forEach(listener => {
        const prevMapped = listener.map ? listener.map(prevState) : prevState;
        const nextMapped = listener.map ? listener.map(nextState) : nextState;
        if (compare(prevMapped, nextMapped) !== prevMapped)
          listener.action(this.currentState, prevState);
      });
    }
  }

  subscribe(action, map = null) {
    this.listeners.push({ map, action });
  }

  unsubscribe(action) {
    this.listeners = this.listeners.filter(fn => fn.action !== action);
  }

  reset() {
    this.currentState = this.initialState;
  }

  update(updater, quiet = false) {
    const nextState = applyChanges(this.currentState, updater);
    if (nextState !== this.currentState) this.set(nextState, quiet);
  }

  /**
   * Returns a Promise that resolves when `check` returns anything other than undefined. `check` is called any time the
   * state updates and changes according to `map`.
   * @param check The method to call when the state updates. If it returns any value other than undefined, the Promise will resolve.
   * @param map The method that determines if the state has updated.
   */
  awaiter(check, map = null) {
    return new Promise(resolve => {
      this.subscribe(state => {
        const result = check(state);
        if (result !== undefined)
          resolve(result);
      }, map);
    });
  }
};
