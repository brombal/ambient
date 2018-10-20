declare type AmbientStateMapper<T> = (state: T) => any;
declare type AmbientStateAction<T> = (state: T, prevState: T) => void;

declare class Ambient<State> {
  get(): State;
  constructor(initialState?: State);
  subscribe(action: AmbientStateAction<State>, map?: AmbientStateMapper<State>): Promise<void>;
  unsubscribe(action: AmbientStateAction<State>): void;
  reset(): void;
  update(updater: AmbientStateAction<State>, quiet?: boolean): void;
  awaiter(check: AmbientStateMapper<State>, map?: AmbientStateMapper<State>): Promise<void>;
}

export default Ambient;
