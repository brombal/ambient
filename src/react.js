const React = require('react');

module.exports = class AmbientSubscribe extends React.Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    this.props.store.subscribe(this.onUpdate, this.props.on);
  }

  componentWillUnmount() {
    this.props.store.unsubscribe(this.onUpdate);
  }

  onUpdate() {
    this.setState({});
  }

  render() {
    return this.props.children(this.props.store.get());
  }
};