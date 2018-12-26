export declare type AmbientStateMapper<T> = (state: T) => any;
declare type AmbientStateAction<T> = (state: T, prevState: T) => void;
export interface IAmbient<State> {
    get(): State;
    on(map: AmbientStateMapper<State>, action: AmbientStateAction<State>): void;
    off(action: AmbientStateAction<State>): void;
    reset(): void;
    update(updater: AmbientStateAction<State>, quiet?: boolean): void;
    awaiter(map: AmbientStateMapper<State>, check: AmbientStateMapper<State>): Promise<void>;
}
export default function createAmbient<State>(state?: State): IAmbient<State>;
export declare class Ambient<State> {
    private initialState;
    currentState: State;
    listeners: {
        map: AmbientStateMapper<State>;
        action: AmbientStateAction<State>;
    }[];
    constructor(initialState?: State);
    get(): State;
    private set;
    on(map: AmbientStateMapper<State>, action: AmbientStateAction<State>): void;
    off(action: AmbientStateAction<State>): void;
    reset(): void;
    update(updater: AmbientStateAction<State>, quiet?: boolean): void;
    /**
     * Returns a Promise that resolves when `check` returns anything other than undefined. `check` is called any time the
     * state updates and changes according to `map`.
     * @param map The method that determines if the state has updated. See Ambient#on().
     * @param check The method to call when the state updates. If it returns any value other than undefined, the Promise will resolve.
     */
    awaiter(map: AmbientStateMapper<State>, check: AmbientStateMapper<State>): Promise<void>;
}
export {};
