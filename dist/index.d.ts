/// <reference types="react" />
declare module "compare" {
    /**
     * Compares a and b for differences.
     * If a and b are identical (===) or equivalent (recursive deep object/array comparison), a is returned.
     * If any properties of a and b are different, `b` is returned. However, all properties of `b` will be compared against
     * `a` using this method.
     */
    export default function compare(a: any, b: any): any;
}
declare module "clone" {
    export default function cloneDeep<T>(value: T): T;
}
declare module "applyChanges" {
    /**
     * Calls `changer`, passing in a draft copy of `object`.
     * If `changer` returns a value other than undefined, it is returned.
     * If `changer` mutates the draft copy, any changes made are applied back to `object`
     * selectively so that equivalent values remain "identical", but changed values do not.
     */
    export default function applyChanges<T>(object: T, changer: (T: any) => any): T;
}
declare module "ambient-react" {
    import * as React from 'react';
    import Ambient, { AmbientStateMapper } from "ambient";
    interface AmbientSubscribeProps<State> {
        store: Ambient<State>;
        on?: AmbientStateMapper<State>;
        children?: (state: State) => React.ReactNode;
    }
    export class AmbientSubscriber<State> extends React.Component<AmbientSubscribeProps<State>> {
        componentDidMount(): void;
        componentWillUnmount(): void;
        onUpdate: () => void;
        render(): React.ReactNode;
    }
    export const withAmbient: (store: any, on: any) => (Component: any) => (props: any) => JSX.Element;
}
declare module "ambient" {
    export { AmbientSubscriber, withAmbient } from "ambient-react";
    export type AmbientStateMapper<T> = (state: T) => any;
    type AmbientStateAction<T> = (state: T, prevState: T) => void;
    export default class Ambient<State> {
        private initialState;
        currentState: State;
        listeners: {
            map: AmbientStateMapper<State>;
            action: AmbientStateAction<State>;
        }[];
        constructor(initialState?: State);
        get(): State;
        private set;
        subscribe(action: AmbientStateAction<State>, map?: AmbientStateMapper<State>): void;
        unsubscribe(action: AmbientStateAction<State>): void;
        reset(): void;
        update(updater: AmbientStateAction<State>, quiet?: boolean): void;
        /**
         * Returns a Promise that resolves when `check` returns anything other than undefined. `check` is called any time the
         * state updates and changes according to `map`.
         * @param check The method to call when the state updates. If it returns any value other than undefined, the Promise will resolve.
         * @param map The method that determines if the state has updated. See Ambient#subscribe().
         */
        awaiter(check: AmbientStateMapper<State>, map?: AmbientStateMapper<State>): Promise<void>;
    }
}
