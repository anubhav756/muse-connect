import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import endPoints from '../../../routes/endPoints'

class UserIsAdmin extends Component {
  componentWillMount() {
    const { user: { info } } = this.props
    if (!info || info.role !== 'admin')
      browserHistory.replace(endPoints.dashboard)
  }

  render() {
    return (
      <div>
        Admin only view
        {this.props.children}
      </div>
    )
  }
}

UserIsAdmin.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(({ user }) => ({ user }))(UserIsAdmin)
