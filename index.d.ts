import * as React from "react";

type AmbientStateMapper<T> = (state: T) => any;
type AmbientStateAction<T> = (state: T, prevState: T) => void;

declare class Ambient<State> {
  state: State;
  constructor(initialState?: State);
  subscribe(action: AmbientStateAction<State>, map?: AmbientStateMapper<State>): Promise<void>;
  unsubscribe(action: AmbientStateAction<State>): void;
  reset(): void;
  update(updater: AmbientStateAction<State>, quiet?: boolean): void;
  awaiter(check: AmbientStateMapper<State>, map?: AmbientStateMapper<State>): Promise<void>;
}

interface AmbientSubscribeProps<State> {
  store: Ambient<State>;
  on: AmbientStateMapper<State>;
  children: AmbientSubscriberChild<State>;
}


// React

type AmbientSubscriberChild<T> = (state: T) => React.ReactElement<any>;

declare namespace Ambient {
  export class Subscribe<State> extends React.Component<AmbientSubscribeProps<State>> {}
}

export = Ambient;
