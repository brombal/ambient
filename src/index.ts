import compare from './compare';
import clone from './clone';
import applyChanges from './applyChanges';

export type AmbientStateMapper<T> = (state: T) => any;
type AmbientStateAction<T> = (state: T, prevState: T) => void;

export default class Ambient<State> {
  currentState: State;
  listeners: { map: AmbientStateMapper<State>, action: AmbientStateAction<State> }[] = [];

  constructor(private initialState: State = {} as any) {
    this.currentState = initialState;
  }

  get(): State {
    return clone(this.currentState);
  }

  private set(nextState, quiet) {
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

  subscribe(action: AmbientStateAction<State>, map: AmbientStateMapper<State> = null): void {
    this.listeners.push({ map, action });
  }

  unsubscribe(action: AmbientStateAction<State>): void {
    this.listeners = this.listeners.filter(fn => fn.action !== action);
  }

  reset(): void {
    this.currentState = this.initialState;
  }

  update(updater: AmbientStateAction<State>, quiet: boolean = false): void {
    const nextState = applyChanges(this.currentState, updater as ((any) => any));
    if (nextState !== this.currentState) this.set(nextState, quiet);
  }

  /**
   * Returns a Promise that resolves when `check` returns anything other than undefined. `check` is called any time the
   * state updates and changes according to `map`.
   * @param check The method to call when the state updates. If it returns any value other than undefined, the Promise will resolve.
   * @param map The method that determines if the state has updated. See Ambient#subscribe().
   */
  awaiter(check: AmbientStateMapper<State>, map?: AmbientStateMapper<State>): Promise<void> {
    return new Promise(resolve => {
      this.subscribe(state => {
        const result = check(state);
        if (result !== undefined)
          resolve(result);
      }, map);
    });
  }
};
