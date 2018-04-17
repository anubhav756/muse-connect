import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {
  RaisedButton
} from 'material-ui'
import { logoutUser as _logoutUser } from '../../redux/modules/user'
import { normaliseSeconds } from '../../libs/helpers/common'
import Modal from '../Modal'
import { MOBILE_VIEW } from '../../libs/helpers/windowDimension'
import './IdleModal.scss';

const notificationMsg = 'You were signed out of your session due to inactivity. Please log into your account to continue your session.'

class IdleModal extends Component {
  constructor() {
    super()
    this.state = {
      remainingTime: 0
    }
    this.initializeTimeout = this.initializeTimeout.bind(this)
    this.handleContinue = this.handleContinue.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }
  componentDidMount() {
    setInterval(() => this.setState({ remainingTime: this.state.remainingTime - 1 }), 1000);
  }
  componentWillReceiveProps({ open: nextOpen }) {
    const { open } = this.props;

    if (!open && nextOpen) {
      this.initializeTimeout();
    }
  }
  componentWillUpdate({ open }, { remainingTime: nextRemainingTime }) {
    if (open && nextRemainingTime <= 0) {
      this.handleLogout({ snackNotification: true });
    }
  }
  initializeTimeout() {
    this.setState({ remainingTime: 300 });
  }
  handleContinue() {
    const { toggleModal } = this.props;

    toggleModal();
  }
  handleLogout({ snackNotification = true }) {
    const { toggleModal, logoutUser } = this.props;
    toggleModal();
    logoutUser({ notificationMsg: snackNotification ? notificationMsg : false });
  }
  render() {
    const { open, toggleModal, windowDimension } = this.props;
    const { remainingTime } = this.state;
    const { min, sec } = normaliseSeconds(remainingTime)
    const timeLabel = `${min ? min > 1 ? `${min} minutes and ` : `${min} minute and ` : ''}${sec !== 1 ? `${sec} seconds` : `${sec} second`}`

    return (
      <Modal
        title="Session Timeout"
        open={open}
        toggleModal={toggleModal}
        autoScrollBodyContent={false}
        titleStyle={{ paddingLeft: 20, paddingRight: 20 }}
        childrenStyle={{ overflowY: 'auto', paddingLeft: 20, paddingRight: 20 }}
        actions={[
          <RaisedButton
            primary
            label={MOBILE_VIEW(windowDimension) ? 'Continue' : 'Continue Session'}
            labelStyle={{ letterSpacing: '0.8px', fontFamily: 'proxima_novasemibold' }}
            onClick={this.handleContinue}
            buttonStyle={{ borderRadius: 10 }}
            style={{ borderRadius: 10, marginBottom: 20, marginRight: 10 }}
          />,
          <RaisedButton
            primary
            label="Sign Out"
            labelStyle={{ letterSpacing: '0.8px', fontFamily: 'proxima_novasemibold' }}
            onClick={() => this.handleLogout({ snackNotification: false })}
            buttonStyle={{ borderRadius: 10 }}
            style={{ borderRadius: 10, marginBottom: 20, marginRight: 3 }}
          />
        ]}
      >
        <div>
          <div>
            {'For your security, you will be automatically\
            signed out of your account due to inactivity.'}
          </div>
          <br />
          <div className="highlighIdleModal">
            {`You will be signed out in ${timeLabel}`}
          </div>
        </div>
      </Modal>
    );
  }
}
IdleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
}

export default connect(
  ({ windowDimension }) => ({ windowDimension }),
  { logoutUser: _logoutUser }
)(IdleModal);
