import * as React from 'react';
import { Ambient } from "./ambient";
Object.defineProperty(Ambient.prototype, 'react', {
    get: function () {
        const ambient = this;
        return class AmbientSubscriber extends React.Component {
            constructor() {
                super(...arguments);
                this.onUpdate = () => {
                    this.setState({});
                };
            }
            componentDidMount() {
                ambient.on(this.props.to, this.onUpdate);
            }
            componentWillUnmount() {
                ambient.off(this.onUpdate);
            }
            render() {
                return this.props.children(ambient.get());
            }
        };
    }
});
Ambient.prototype.connect = function (on) {
    const ambient = this;
    return (Component) => (props) => {
        return (React.createElement(ambient.react, { to: on }, state => (React.createElement(Component, Object.assign({}, props, { ambient: state })))));
    };
};
//# sourceMappingURL=react.js.map