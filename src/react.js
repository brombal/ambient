const React = require('react');
const Ambient = require('./index');

Ambient.Subscribe = class Subscribe extends React.Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    this.props.ambient.subscribe(this.onUpdate, this.props.on);
  }

  componentWillUnmount() {
    this.props.ambient.unsubscribe(this.onUpdate);
  }

  onUpdate() {
    this.setState({});
  }

  render() {
    return this.props.children(this.props.ambient.state);
  }
};