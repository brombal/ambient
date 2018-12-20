import * as React from 'react';
import Ambient, { AmbientStateMapper } from "./ambient";

interface AmbientSubscribeProps<State> {
  store: Ambient<State>;
  on?: AmbientStateMapper<State>;
  children?: (state: State) => React.ReactNode;
}

export class AmbientSubscriber<State> extends React.Component<AmbientSubscribeProps<State>> {
  componentDidMount() {
    this.props.store.subscribe(this.onUpdate, this.props.on);
  }

  componentWillUnmount() {
    this.props.store.unsubscribe(this.onUpdate);
  }

  onUpdate = () => {
    this.setState({});
  };

  render() {
    return this.props.children(this.props.store.get());
  }
}

export const withAmbient = (store, on) => (Component) => (props) => {
  return (
    <AmbientSubscriber store={store} on={on}>
      {ambient => (
        <Component {...props} ambient={ambient} />
      )}
    </AmbientSubscriber>
  );
};
