import * as React from "react";

type StateMapper<T> = (state: T) => any;
type StateAction<T> = (state: T, prevState: T) => void;

declare class Ambient<State> {
  state: State;
  constructor(initialState?: State);
  subscribe(action: StateAction<State>, map?: StateMapper<State>): Promise<void>;
  unsubscribe(action: StateAction<State>): void;
  reset(): void;
  update(updater: StateAction<State>, quiet?: boolean): void;
  awaiter(check: StateMapper<State>, map?: StateMapper<State>): Promise<void>;
}

interface AmbientSubscribeProps<State> {
  store: Ambient<State>;
  on: StateMapper<State>;
}

declare namespace Ambient {
  export class Subscribe<State> extends React.Component<AmbientSubscribeProps<State>> {}
}

export = Ambient;
