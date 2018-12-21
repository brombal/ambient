export { AmbientSubscriber, withAmbient } from './ambient-react';
export declare type AmbientStateMapper<T> = (state: T) => any;
declare type AmbientStateAction<T> = (state: T, prevState: T) => void;
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
