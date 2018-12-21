import * as React from 'react';
export class AmbientSubscriber extends React.Component {
    constructor() {
        super(...arguments);
        this.onUpdate = () => {
            this.setState({});
        };
    }
    componentDidMount() {
        this.props.store.subscribe(this.onUpdate, this.props.on);
    }
    componentWillUnmount() {
        this.props.store.unsubscribe(this.onUpdate);
    }
    render() {
        return this.props.children(this.props.store.get());
    }
}
export const withAmbient = (store, on) => (Component) => (props) => {
    return (React.createElement(AmbientSubscriber, { store: store, on: on }, ambient => (React.createElement(Component, Object.assign({}, props, { ambient: ambient })))));
};
//# sourceMappingURL=ambient-react.js.map