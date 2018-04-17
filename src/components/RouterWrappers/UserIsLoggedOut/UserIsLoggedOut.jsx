import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import { DefaultLayout } from '../../../layout'
import endpoints from '../../../routes/endPoints'
import { isTokenUnavailable } from '../../../libs/helpers/auth'

function redirectIfLoggedIn(user) {
  if (user.info || !isTokenUnavailable()) {
    browserHistory.push(endpoints.dashboard)
  }
}

class UserIsLoggedOut extends Component {
  componentWillMount() {
    const { user } = this.props
    redirectIfLoggedIn(user)
  }

  render() {
    return (
      <DefaultLayout>
        {this.props.children}
      </DefaultLayout>
    )
  }
}

UserIsLoggedOut.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(({ user }) => ({ user }))(UserIsLoggedOut)
