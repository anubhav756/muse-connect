import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col, Row } from 'react-flexbox-grid'
import { browserHistory } from 'react-router'
import { RaisedButton } from 'material-ui';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import Auth from '../../libs/auth/auth'
import endPoints from '../../routes/endPoints'
import Modal from '../../components/Modal'
import AuthViewFooter from '../../components/AuthViewFooter'
import { MOBILE_VIEW } from '../../libs/helpers/windowDimension'
import './SignIn.scss'

const mobileTitleStyle = { fontFamily: 'proxima_novasemibold', color: colors.darkGrey, fontSize: '20px', paddingLeft: '20px', paddingRight: '40px', lineHeight: '26px' }
const titleStyle = { fontFamily: 'proxima_novasemibold', color: colors.darkGrey, fontSize: '26px', paddingLeft: '42px', paddingRight: '42px', lineHeight: '32px' }

class SignIn extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
    this.authCallback = this.authCallback.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    const params = browserHistory.getCurrentLocation().query
    const { email, message, success } = params
    const authOptions = {
      prefill: {
        email
      },
      allowSignUp: false
    }
    const flashMessage = message && {
      type: success === 'true' ? 'success' : 'error',
      text: message,
    }
    const auth = new Auth(this.toggleModal, authOptions)
    auth.init(this.authCallback, { flashMessage })
  }

  authCallback() {
    const { routing } = this.props
    const redirect = routing &&
      routing.locationBeforeTransitions &&
      routing.locationBeforeTransitions.query &&
      routing.locationBeforeTransitions.query.redirect
    browserHistory.push(redirect || endPoints.dashboard)
  }
  toggleModal() {
    this.setState({
      open: !this.state.open
    });
  }
  handleCancel() {
    this.toggleModal()
  }
  handleLogout() {
    location.reload()
  }
  render() {
    const { open } = this.state
    const { windowDimension } = this.props
    const isMobile = MOBILE_VIEW(windowDimension)
    return (
      <Row>
        <Modal
          open={open}
          title="Private Browsing"
          style={{ maxWidth: 600 }}
          iconName="x-grey-icon"
          titleStyle={isMobile ? mobileTitleStyle : titleStyle}
          toggleModal={this.toggleModal}
          autoScrollBodyContent={false}
          iconStyle={{ right: isMobile ? '6px' : '12px' }}
          childrenStyle={{ paddingLeft: isMobile ? '20px' : '42px', paddingRight: isMobile ? '20px' : '42px', overflowY: 'auto' }}
          actions={[
            <RaisedButton
              key="Cancel_Button"
              label={'Cancel'}
              labelStyle={{ fontFamily: 'proxima_novasemibold', letterSpacing: '.8px' }}
              onClick={this.handleCancel}
              style={{ marginRight: 14, marginBottom: 20, borderRadius: '10px' }}
              buttonStyle={{ borderRadius: '10px' }}
              overlayStyle={{ borderRadius: '10px' }}
            />,
            <RaisedButton
              key="Sign_Out"
              label={'Sign Out'}
              keyboardFocused
              labelStyle={{ fontFamily: 'proxima_novasemibold', letterSpacing: '.8px' }}
              primary
              onClick={this.handleLogout}
              style={{ marginRight: isMobile ? '20px' : '34px', marginBottom: 20, borderRadius: '10px' }}
              buttonStyle={{ borderRadius: '10px' }}
              overlayStyle={{ borderRadius: '10px' }}
            />
          ]}
        >
          <div style={{ marginTop: '10px', fontFamily: 'proxima_novamedium', color: colors.mediumGrey }}>
            {"Please sign out of your Muse Connect account and turn 'Private Browsing' off in your browser on your device. This will let you see your information properly when you sign back in. For instructions on how to do this, click one of these links based on your device and browser:"}
            <br />
            <a className="hyperLink" href="https://support.apple.com/en-ca/HT203036">Safari</a>
            <br />
            <a className="hyperLink" href="https://help.yahoo.com/kb/SLN24556.html">Other</a>
          </div>
        </Modal>
        <AuthViewFooter />
        <Col md={1} />
        <Col md={3} xs={12} className="contentWrap" style={{ padding: '0px' }} >
          <div id="auth" />
          <div className="helpLinkSignIn">
            {'Don\'t have a Muse Connect account? '}
            <span onClick={() => browserHistory.push(endPoints.signup)} className="hyperLink">Sign up now.</span>
          </div>
        </Col>
        <Col md={1} />
        <Col md={7} sm={12} className="sideImageSignIn" />
      </Row>
    )
  }
}
SignIn.propTypes = {
  routing: PropTypes.object.isRequired,
  windowDimension: PropTypes.object.isRequired
}

export default connect(({ routing, windowDimension }) => ({ routing, windowDimension }))(SignIn)
