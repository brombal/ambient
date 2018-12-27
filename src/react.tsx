import * as React from 'react';
import { IAmbient, AmbientStateMapper, Index } from "./index";

/**
 * Infers prop type from component C
 */
type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;

/**
 * Applies LibraryManagedAttributes (proper handling of defaultProps and propTypes).
 */
type ConnectedComponentClass<C, P> = React.ComponentType<JSX.LibraryManagedAttributes<C, P>>;

/**
 * Omits properties K from type T
 * Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Only types in union T that are assignable to U
 * @example
 *   type TypeA = 'a' | 'b' | 'c'
 *   type TypeB = 'b' | 'c' | 'd'
 *   Intersect<TypeA, TypeB>
 *     --> 'b' | 'c'
 */
type Intersect<T, U> = T extends U ? T : never;

/**
 * Omits WithoutType's properties from Type. Similar to Omit except WithoutType can contain properties that do not
 * exist in Type.
 * @example
 *   interface TypeA { a: any; b: any; c: any; }
 *   interface TypeB { b: any; c: any; d: any; }
 *   OmitProperties<TypeA, TypeB>
 *     --> { a: any } (omits b, c, and d from TypeA)
 */
type OmitProperties<Type, WithoutType> = Omit<Type, Intersect<keyof Type, keyof WithoutType>>;

/**
 * A component with the properties of WithoutProps omitted from the props of Component
 */
type ComponentWithoutProps<Component, WithoutProps> =
  ConnectedComponentClass<Component, OmitProperties<GetProps<Component>, WithoutProps>>;


interface AmbientReactProps<State> {
  to?: AmbientStateMapper<State>;
  children?: (state: State) => React.ReactNode;
}

export interface AmbientConnectProps<State> {
  ambient: State;
}

declare module "./index" {
  export interface IAmbient<State> {
    react: React.ComponentClass<AmbientReactProps<State>>;
    connect: (
      on: AmbientStateMapper<State>
    ) => (
      <T extends React.ComponentType>(Component: T) =>
        ComponentWithoutProps<T, AmbientConnectProps<State>>
    );
  }
}

/**
 * This has to be defined as a getter method so that `this` can be used correctly.
 */
Object.defineProperty(Index.prototype, 'react', {
  get: function () {
    const ambient = this;
    return class AmbientSubscriber<State> extends React.Component<AmbientReactProps<State>> {
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

(Index.prototype as any).connect = function<AmbientState>(on: AmbientStateMapper<AmbientState>) {
  const ambient = this;
  return (Component: React.ComponentType<AmbientConnectProps<any>>) => (props) => {
    return (
      <ambient.react to={on}>
        {state => (
          <Component {...props} ambient={state} />
        )}
      </ambient.react>
    );
  };
};
