import * as React from 'react';
import Ambient, { AmbientStateMapper } from "./ambient";
interface AmbientSubscribeProps<State> {
    store: Ambient<State>;
    on?: AmbientStateMapper<State>;
    children?: (state: State) => React.ReactNode;
}
export declare class AmbientSubscriber<State> extends React.Component<AmbientSubscribeProps<State>> {
    componentDidMount(): void;
    componentWillUnmount(): void;
    onUpdate: () => void;
    render(): React.ReactNode;
}
export declare const withAmbient: (store: any, on: any) => (Component: any) => (props: any) => JSX.Element;
export {};
