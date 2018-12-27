"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var index_1 = require("./index");
/**
 * This has to be defined as a getter method so that `this` can be used correctly.
 */
Object.defineProperty(index_1.Index.prototype, 'react', {
    get: function () {
        var ambient = this;
        return /** @class */ (function (_super) {
            __extends(AmbientSubscriber, _super);
            function AmbientSubscriber() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.onUpdate = function () {
                    _this.setState({});
                };
                return _this;
            }
            AmbientSubscriber.prototype.componentDidMount = function () {
                ambient.on(this.props.to, this.onUpdate);
            };
            AmbientSubscriber.prototype.componentWillUnmount = function () {
                ambient.off(this.onUpdate);
            };
            AmbientSubscriber.prototype.render = function () {
                return this.props.children(ambient.get());
            };
            return AmbientSubscriber;
        }(React.Component));
    }
});
index_1.Index.prototype.connect = function (on) {
    var ambient = this;
    return function (Component) { return function (props) {
        return (React.createElement(ambient.react, { to: on }, function (state) { return (React.createElement(Component, __assign({}, props, { ambient: state }))); }));
    }; };
};
//# sourceMappingURL=react.js.map