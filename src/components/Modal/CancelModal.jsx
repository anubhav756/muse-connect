import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import RaisedButton from 'material-ui/RaisedButton';

let _alert = () => Promise.resolve();
const alert = warningText => _alert(warningText);
export default alert;

export class CancelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      warningText: null,
      promise: null
    }
    this.handleClose = this.handleClose.bind(this);
    _alert = this.trigger.bind(this);
  }
  trigger(warningText) {
    return new Promise((resolve, reject) => {
      this.setState({
        promise: {
          resolve,
          reject
        },
        warningText,
        open: true
      })
    });
  }
  handleClose() {
    this.setState({
      open: false
    })
  }
  render() {
    const actions = [
      <RaisedButton
        label="Yes"
        primary
        style={{ marginRight: '10px', borderRadius: '10px' }}
        buttonStyle={{ borderRadius: '10px' }}
        overlayStyle={{ borderRadius: '10px' }}
        onClick={() => { this.handleClose(); this.state.promise.resolve() }}
      />,
      <RaisedButton
        label="No"
        primary
        keyboardFocused
        style={{ borderRadius: '10px' }}
        buttonStyle={{ borderRadius: '10px' }}
        overlayStyle={{ borderRadius: '10px' }}
        onClick={() => { this.handleClose(); this.state.promise.reject() }}
      />
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        style={{ zIndex: 10001 }}
        overlayStyle={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
      >
        <div style={{ fontFamily: 'proxima_novamedium', color: colors.mediumGrey, }}>
          {this.state.warningText}
        </div>
      </Dialog>
    );
  }
}
