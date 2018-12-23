import * as React from 'react';
import { IAmbient, AmbientStateMapper, Ambient } from "./ambient";

interface AmbientSubscribeProps<State> {
  to?: AmbientStateMapper<State>;
  children?: (state: State) => React.ReactNode;
}

declare module "./ambient" {
  export interface IAmbient<State> {
    react: any;
    connect: any;
  }
}

Object.defineProperty(Ambient.prototype, 'react', {
  get: function () {
    const ambient = this;
    return class AmbientSubscriber<State> extends React.Component<AmbientSubscribeProps<State>> {
      componentDidMount() {
        ambient.on(this.props.to, this.onUpdate);
      }

      componentWillUnmount() {
        ambient.off(this.onUpdate);
      }

      onUpdate = () => {
        this.setState({});
      };

      render() {
        return this.props.children(ambient.get());
      }
    };
  }
});


(Ambient.prototype as any).connect = function(on) {
  const ambient = this;
  return (Component) => (props) => {
    return (
      <ambient.react to={on}>
        {state => (
          <Component {...props} ambient={state} />
        )}
      </ambient.react>
    );
  };
};
