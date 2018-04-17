import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import { _wasSubscribed } from '../../libs/helpers/reduxAuth'

export function AccountSidebar(props) {
  const {
    user,
    user: {
      info: {
        firstName, lastName, avatar, businessName, muserSince, museConnecterSince
      }
    }
  } = props;
  const wasSubscribedStatus = _wasSubscribed(user)
  return (
    <Sidebar
      title={wasSubscribedStatus ? null : 'Dashboard'}
      backLink={wasSubscribedStatus ? null : '/'}
      user={{ avatar, firstName, lastName }}
      userDetails={[{
        label: businessName,
        key: 0
      }, {
        key: 1
      }, {
        label: `Muser since ${moment(muserSince).format('MMMM YYYY')}`,
        key: 2
      }, {
        label: `Muse Connecter since ${moment(museConnecterSince).format('MMMM YYYY')}`,
        key: 3
      }, {
        key: 4
      }]}
    />
  )
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(AccountSidebar)

AccountSidebar.propTypes = {
  user: PropTypes.object.isRequired
}

