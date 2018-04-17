import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col, Row } from 'react-flexbox-grid'
import { browserHistory } from 'react-router'
import Auth from '../../libs/auth/auth'
import endPoints from '../../routes/endPoints'
import AuthViewFooter from '../../components/AuthViewFooter'
import './SignUp.scss'

class SignUp extends Component {
  constructor() {
    super()
    this.authCallback = this.authCallback.bind(this)
  }

  componentDidMount() {
    const params = browserHistory.getCurrentLocation().query
    const { email, message, success } = params
    const authOptions = {
      prefill: {
        email
      },
      allowLogin: false
    }
    const flashMessage = message && {
      type: success === 'true' ? 'success' : 'error',
      text: message,
    }
    const auth = new Auth(null, authOptions)
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

  render() {
    return (
      <Row>
        <AuthViewFooter />
        <Col md={1} />
        <Col md={3} xs={12} className="contentWrap" style={{ padding: '0px' }} >
          <div id="auth" />
          <div className="helpLinkSignUp">
            {'Already have a Muse Connect account? '}
            <span onClick={() => browserHistory.push(endPoints.signin)} className="hyperLink">Log in.</span>
          </div>
        </Col>
        <Col md={1} />
        <Col md={7} sm={12} className="sideImageSignUp" />
      </Row>
    )
  }
}
SignUp.propTypes = {
  routing: PropTypes.object.isRequired
}

export default connect(({ routing }) => ({ routing }))(SignUp)
