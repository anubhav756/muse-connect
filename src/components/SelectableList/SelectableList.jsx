import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, makeSelectable } from 'material-ui/List';

function wrapState(ComposedComponent) {
  return class extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      value: PropTypes.number.isRequired,
      style: PropTypes.object
    };
    static defaultProps = {
      style: {}
    }

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.value,
      });
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        selectedIndex: nextProps.value,
      });
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          style={this.props.style}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

export default wrapState(makeSelectable(List));
