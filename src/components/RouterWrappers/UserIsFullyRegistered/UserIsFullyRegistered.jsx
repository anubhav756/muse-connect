import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import { ProfessionalLayout } from '../../../layout'
import endPoints from '../../../routes/endPoints'
import Loader from '../../../components/Loader'
import { _isRegisterd, _isOnboardComplete } from '../../../libs/helpers/reduxAuth'

// controller function protect and controls user direction at Professional layout
function controlUserPath(user, location) {
  // if onboard is not completed
  if (!_isOnboardComplete(user)) {
    return false
  }
  // is currently subscribed muser
  if (_isRegisterd(user)) {
    return true
  }
  // obvious case i.e former subscribed muser
  const accountPattern = new RegExp(`^${endPoints.account.index}`);
  const invoicePattern = new RegExp(`^${endPoints.invoice}`);
  const faqPattern = new RegExp(`^${endPoints.faqs}`);
  if (
    !accountPattern.test(location.pathname) &&
    !invoicePattern.test(location.pathname) &&
    !faqPattern.test(location.pathname)
  ) {
    browserHistory.replace(`${endPoints.account.index}/plans`)
    return true
  }
  return true
}

function checkFullyRegistered(user, location) {
  if (!controlUserPath(user, location))
    browserHistory.replace(endPoints.onboarding.index)
}

class UserIsFullyRegistered extends Component {
  componentWillMount() {
    const { user, location } = this.props;

    checkFullyRegistered(user, location)
  }

  componentWillReceiveProps(nextProps) {
    const { user, location } = nextProps;

    checkFullyRegistered(user, location)
  }

  render() {
    const { user } = this.props
    if (!_isOnboardComplete(user)) {
      return <Loader />
    }
    return (
      <ProfessionalLayout>
        {this.props.children}
      </ProfessionalLayout>
    )
  }
}

UserIsFullyRegistered.propTypes = {
  user: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default connect(({ user }) => ({ user }))(UserIsFullyRegistered)
