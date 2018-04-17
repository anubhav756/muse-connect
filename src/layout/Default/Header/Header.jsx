import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { AppBar, FlatButton } from 'material-ui'
import './Header.scss'
import { MOBILE_VIEW } from '../../../libs/helpers/windowDimension'
import { logoutUser } from '../../../redux/modules/user'
import { cleverTapSignoutClick } from '../../../libs/cleverTap'

/*
 * @function doCancel calls the callback function onCancelAction
 */
function doLogout() {
  cleverTapSignoutClick()
  this.props.logoutUser({ notificationMsg: false })
}

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.doLogout = doLogout.bind(this)
  }
  render() {
    const { wd } = this.props
    return (
      <AppBar
        style={{ position: 'fixed', top: '0px' }}
        title={
          <img
            src={
              MOBILE_VIEW(wd) ?
                '/images/logo/Muse_connect_color@3x.png' :
                '/images/logo/Connect copy@3x.png'
            }
            className="title"
            alt="Logo"
          />
        }
        onTitleClick={() => browserHistory.push('/')}
        iconStyleLeft={{ display: 'none' }}
        zDepth={2}
        iconElementRight={
          <FlatButton
            label={'Sign Out'}
            onClick={this.doLogout}
            labelStyle={{ textTransform: 'none' }}
          />
        }
      />
    )
  }
}
Header.propTypes = {
  wd: PropTypes.object.isRequired
}

export default connect(({ windowDimension: wd }) =>
  ({ wd }), { logoutUser })(Header)
