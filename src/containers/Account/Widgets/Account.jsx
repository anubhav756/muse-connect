import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Divider
} from 'material-ui';
import moment from 'moment'
import breakPoints from '!!sass-variable-loader!./../../../styles/variables/breakpoints.scss';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import {
  updateAccount as _updateAccount,
  resetPassword as _resetPassword
} from '../../../redux/modules/account'
import { notify } from '../../../redux/modules/notice';
import EditableLabel from '../../../components/EditableLabel'
import UserAvatar from '../../../components/UserAvatar'
import { isValidEmail } from '../../../libs/helpers/validator'

import './Account.scss';

const emailUpdateMessage = 'Your email address has been changed and a verification email has been sent to your new email address. Please verify your email and log into your account.'
const nameUpdateMessage = 'Your Name has been updated'
const displayNameUpdateMessage = 'Your Display Name has been updated'
const displayEmailUpdateMessage = 'Your Display Email has been updated'

function emailValidator(email) {
  if (!email || !email.trim()) {
    return 'Required'
  } else if (!isValidEmail(email)) {
    return 'Invalid email address'
  }
  return ''
}
class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nameField: false,
      emailField: false,
      display_nameField: false,
      display_emailField: false,
      passwordField: false
    }
    this.showSnackBarMessage = this.showSnackBarMessage.bind(this)
  }

  handlePasswordReset() {
    const { resetPassword } = this.props;
    const { email } = this.props.user.info;

    if (!this.state.passwordResetDisabled)
      resetPassword(email);

    this.setState({
      passwordResetDisabled: true
    });

    setTimeout(() => {
      this.setState({
        passwordResetDisabled: false
      });
    }, 2000);
  }

  showSnackBarMessage(err, message) {
    if (!err) {
      this.props.notify({ message })
    }
  }

  render() {
    const {
      updateAccount,
      resetPassword,
      user: {
        info: {
          firstName,
          lastName,
          avatar,
          muserSince,
          museConnecterSince,
          email,
          displayEmail,
          displayName,
          socialLogin
        }
      },
      innerWidth
    } = this.props;

    const {
      nameField,
      emailField,
      display_nameField,
      display_emailField
    } = this.state;
    return (
      <div>
        {
          innerWidth <= parseInt(breakPoints.breakPointSm, 10) &&
          <div className="TopbarAccount">
            <div style={{ display: 'inline', float: 'left', marginRight: 28 }}>
              <UserAvatar
                user={{ avatar, firstName, lastName }}
                size={75}
                fontSize={30}
              />
            </div>
            <div style={{ width: 'auto', overflow: 'hidden', marginTop: 20 }}>
              <div className="DetailsAccount">Muser since {moment(muserSince).format('MMMM YYYY')}</div>
              <div className="DetailsAccount" style={{ marginTop: 2 }}>Muse Connecter since {moment(museConnecterSince).format('MMMM YYYY')}</div>
            </div>
          </div>
        }
        <div className="FormGroupHeaderAccount">
          Your Account Information
        </div>
        <div className="FormGroupSubheaderAccount">
          {
            innerWidth <= parseInt(breakPoints.breakPointSm, 10) &&
            <Divider
              style={{
                background: colors.lightestGrey,
                marginBottom: -30,
                marginTop: 30,
                marginLeft: -35,
                marginRight: -35
              }}
            />
          }
        </div>
        <EditableLabel
          tabIndex="0"
          title="Your Name"
          value={`${firstName} ${lastName}`}
          editLabel="Edit your name"
          loading={nameField}
          onChange={(value) => {
            const names = value.split(' ');
            const new_last_name = names.splice(1).join(' ');
            const new_first_name = names.join(' ');
            this.setState({ nameField: true });
            updateAccount({
              firstName: new_first_name,
              lastName: new_last_name
            }, (err) => {
              this.setState({ nameField: false })
              this.showSnackBarMessage(err, nameUpdateMessage)
            });
          }}
        />
        <EditableLabel
          tabIndex="-1"
          title="Your Email"
          labelOnly={socialLogin}
          value={email}
          editLabel={socialLogin ? '' : 'Edit your email'}
          validation={emailValidator}
          loading={emailField}
          onChange={(new_email) => {
            this.setState({ emailField: true })
            updateAccount({ email: new_email }, (err) => {
              this.setState({ emailField: false })
              this.showSnackBarMessage(err, emailUpdateMessage)
            });
          }}
        />
        {
        !socialLogin &&
        <EditableLabel
          labelOnly
          tabIndex="-1"
          title="Your Password"
          value="••••••••••••"
          editLabel="Edit your password"
          loading={this.state.passwordResetDisabled}
          editClick={this.handlePasswordReset.bind(this)}
        />
        }
        <div className="FormGroupPaddingAccount" />

        <div className="FormGroupHeaderAccount">
          Display Name and Information
        </div>
        <div className="FormGroupSubheaderAccount">
          Your name and email will be shown to clients when you request access to their data. You can change your display information below.
          {
            innerWidth <= parseInt(breakPoints.breakPointSm, 10) &&
            <Divider
              style={{
                background: colors.lightestGrey,
                marginBottom: -30,
                marginTop: 30,
                marginLeft: -35,
                marginRight: -35
              }}
            />
          }
        </div>
        <EditableLabel
          tabIndex="-3"
          title="Your Display Name"
          value={displayName}
          editLabel="Edit your display name"
          loading={display_nameField}
          onChange={(new_display_name) => {
            this.setState({ display_nameField: true })
            updateAccount({
              displayName: new_display_name
            }, (err) => {
              this.setState({ display_nameField: false })
              this.showSnackBarMessage(err, displayNameUpdateMessage)
            });
          }}
        />
        <EditableLabel
          tabIndex="-4"
          title="Your Display Email"
          value={displayEmail}
          validation={emailValidator}
          editLabel="Edit your display email"
          loading={display_emailField}
          onChange={(new_display_email) => {
            this.setState({ display_emailField: true })
            updateAccount({
              displayEmail: new_display_email
            }, (err) => {
              this.setState({ display_emailField: false })
              this.showSnackBarMessage(err, displayEmailUpdateMessage)
            });
          }}
        />
        <div className="FormGroupPaddingAccount" />
        <div style={{ height: 120 }} />
      </div>
    )
  }
}
Account.propTypes = {
  updateAccount: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  innerWidth: PropTypes.number.isRequired
}

export default connect(
  ({ user, windowDimension: { innerWidth } }) => ({
    user,
    innerWidth
  }), {
    updateAccount: _updateAccount,
    resetPassword: _resetPassword,
    notify
  }
)(Account);
