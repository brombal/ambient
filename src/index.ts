import compare from './compare';
import clone from './clone';
import applyChanges from './applyChanges';

export type AmbientStateMapper<T> = (state: T) => any;
type AmbientStateAction<T> = (state: T, prevState: T) => void;

export interface IAmbient<State> {
  get(): State;
  on(map: AmbientStateMapper<State>, action: AmbientStateAction<State>): void;
  off(action: AmbientStateAction<State>): void;
  reset(): void;
  update(updater: AmbientStateAction<State>, quiet?: boolean): void;
  awaiter(map: AmbientStateMapper<State>, check: AmbientStateMapper<State>): Promise<void>;
}

export default function createAmbient<State>(state: State = {} as any): IAmbient<State> {
  return (new Index<State>(state) as any) as IAmbient<State>;
}

export class Index<State> {
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

  on(map: AmbientStateMapper<State>, action: AmbientStateAction<State>): void {
    this.listeners.push({ map, action });
  }

  off(action: AmbientStateAction<State>): void {
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
   * @param map The method that determines if the state has updated. See Ambient#on().
   * @param check The method to call when the state updates. If it returns any value other than undefined, the Promise will resolve.
   */
  awaiter(map: AmbientStateMapper<State>, check: AmbientStateMapper<State>): Promise<void> {
    return new Promise(resolve => {
      this.on(state => {
        const result = check(state);
        if (result !== undefined)
          resolve(result);
      }, map);
    });
  }
};
