"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compare_1 = require("./compare");
var clone_1 = require("./clone");
var applyChanges_1 = require("./applyChanges");
var ambient_react_1 = require("./ambient-react");
exports.AmbientSubscriber = ambient_react_1.AmbientSubscriber;
exports.withAmbient = ambient_react_1.withAmbient;
var Ambient = /** @class */ (function () {
    function Ambient(initialState) {
        if (initialState === void 0) { initialState = {}; }
        this.initialState = initialState;
        this.listeners = [];
        this.currentState = initialState;
    }
    Ambient.prototype.get = function () {
        return clone_1.default(this.currentState);
    };
    Ambient.prototype.set = function (nextState, quiet) {
        var _this = this;
        var prevState = this.currentState;
        this.currentState = nextState;
        if (!quiet) {
            this.listeners.forEach(function (listener) {
                var prevMapped = listener.map ? listener.map(prevState) : prevState;
                var nextMapped = listener.map ? listener.map(nextState) : nextState;
                if (compare_1.default(prevMapped, nextMapped) !== prevMapped)
                    listener.action(_this.currentState, prevState);
            });
        }
    };
    Ambient.prototype.subscribe = function (action, map) {
        if (map === void 0) { map = null; }
        this.listeners.push({ map: map, action: action });
    };
    Ambient.prototype.unsubscribe = function (action) {
        this.listeners = this.listeners.filter(function (fn) { return fn.action !== action; });
    };
    Ambient.prototype.reset = function () {
        this.currentState = this.initialState;
    };
    Ambient.prototype.update = function (updater, quiet) {
        if (quiet === void 0) { quiet = false; }
        var nextState = applyChanges_1.default(this.currentState, updater);
        if (nextState !== this.currentState)
            this.set(nextState, quiet);
    };
    /**
     * Returns a Promise that resolves when `check` returns anything other than undefined. `check` is called any time the
     * state updates and changes according to `map`.
     * @param check The method to call when the state updates. If it returns any value other than undefined, the Promise will resolve.
     * @param map The method that determines if the state has updated. See Ambient#subscribe().
     */
    Ambient.prototype.awaiter = function (check, map) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.subscribe(function (state) {
                var result = check(state);
                if (result !== undefined)
                    resolve(result);
            }, map);
        });
    };
    return Ambient;
}());
exports.default = Ambient;
;
//# sourceMappingURL=ambient.js.map