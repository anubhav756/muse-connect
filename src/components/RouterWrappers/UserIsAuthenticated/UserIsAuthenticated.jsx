import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Loader from '../../../components/Loader'
import endpoints from '../../../routes/endPoints'
import { fetchUser, logoutUser } from '../../../redux/modules/user'

class UserIsAuthenticated extends Component {
  componentWillMount() {
    this.props.fetchUser((error) => {
      if (error) {
        const redirectUrl = `${endpoints.signin}?redirect=${this.props.location.pathname}`
        this.props.logoutUser({ redirectUrl })
      }
    })
  }

  render() {
    const { user } = this.props
    if (_.isEmpty(user.info) || user.isFetching) {
      return (
        <Loader />
      )
    }
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

UserIsAuthenticated.propTypes = {
  user: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  fetchUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

export default connect(({ user }) => ({ user }), { fetchUser, logoutUser })(UserIsAuthenticated)
