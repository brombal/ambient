import * as React from "react";
import Ambient from './index';

declare type AmbientStateMapper<T> = (state: T) => any;

interface AmbientSubscribeProps<State> {
  store: Ambient<State>;
  on?: AmbientStateMapper<State>;
  children: AmbientSubscriberChild<State>;
}

type AmbientSubscriberChild<T> = (state: T) => React.ReactNode;

declare class AmbientSubscriber<State> extends React.Component<AmbientSubscribeProps<State>> {}

export default AmbientSubscriber;
