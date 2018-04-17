import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { browserHistory, Link } from 'react-router'
import {
  FlatButton,
  Popover,
  Menu,
  MenuItem,
  IconButton
} from 'material-ui'
import { PopoverAnimationVertical } from 'material-ui/Popover';
import { connect } from 'react-redux'
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import endPoints from '../../../routes/endPoints'
import Icon from '../../../components/Icon'
import { logoutUser as _logoutUser } from '../../../redux/modules/user'
import UserAvatar from '../../../components/UserAvatar';
import SearchClients from '../../../components/SearchClients/SearchClientsApiWrap'
import { MOBILE_VIEW, DESKTOP_VIEW } from '../../../libs/helpers/windowDimension';
import { _wasSubscribed } from '../../../libs/helpers/reduxAuth'
import { cleverTapSignoutClick } from '../../../libs/cleverTap'
import './Header.scss'

const menuItemsMap = [{
  label: 'Sign Out',
  iconName: 'logout-icon',
  callback() {
    cleverTapSignoutClick()
    this.props.logoutUser({ notificationMsg: false });
  }
}, {
  //   label: 'Report a Bug',
  //   iconName: 'bug-icon',
  //   callback() {
  //     this.setState({ open: false });
  //   }
  // }, {
  //   label: 'Launch Tutorial',
  //   iconName: 'tooltip-icon',
  //   callback() {
  //     this.setState({ open: false });
  //   }
  // }, {
  label: 'Account Settings',
  iconName: 'settings-icon',
  callback() {
    browserHistory.push(endPoints.account.index)
  }
},
{
  label: 'FAQs',
  iconName: 'faq',
  callback() {
    browserHistory.push(endPoints.faqs)
  }
},
{
  component() {
    return (
      <Link
        key="Contact Us"
        href="mailto:customercare@choosemuse.com"
        style={{ textDecoration: 'none' }}
      >
        <MenuItem
          primaryText="Contact Us"
          leftIcon={
            <Icon
              name="email-icon"
              fill={colors.lightGrey}
              style={{ height: 20, width: 20 }}
            />
          }
          onClick={() => this.setState({ open: false })}
          style={{ color: colors.darkGrey, paddingLeft: 10 }}
        />
      </Link>
    )
  }
}];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
    this.handleTouchTap = this.handleTouchTap.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }
  handleTouchTap(event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  render() {
    const {
      toggleSideBar,
      user,
      user: {
        info: {
          firstName, lastName, avatar
        }
      },
      wd
    } = this.props;
    const {
      open,
      anchorEl
    } = this.state;
    const True = true
    const wasSubscribedStatus = _wasSubscribed(user)
    return (
      <div className={'containerHeaderProfessional museconnectPrintHeader'} >
        <Toolbar
          style={{
            height: '64px',
            maxWidth: '1200px',
            backgroundColor: colors.teal,
            margin: '0 auto'
          }}
        >
          <ToolbarGroup >
            {
              !wasSubscribedStatus &&
              <IconButton onClick={toggleSideBar} iconStyle={{ width: '18px' }} style={{ margin: '0 20px 0 0', width: '18px', height: '23px', padding: '0px' }} >
                <Icon name="menu-icon" fill="white" />
              </IconButton>
            }
            <ToolbarTitle
              onClick={() => browserHistory.push('/')}
              text={
                <img
                  src={
                    MOBILE_VIEW(wd) ?
                      '/images/logo/Muse_connect_color@3x.png' :
                      '/images/logo/Connect copy@3x.png'
                  }
                  style={{ verticalAlign: 'middle' }}
                  className="titleHeader"
                  alt="Logo"
                />
              }
            />
            <div className="searchBarWrapHeader">
              <div className="searchBarHeader" >
                {
                  !wasSubscribedStatus &&
                  <SearchClients />
                }
              </div>
            </div>
          </ToolbarGroup>
          <ToolbarGroup lastChild={True} style={{ margin: 0, width:DESKTOP_VIEW(wd) ? 265 : 196 }}>
            <div style={{ height: 64, margin: 0, position: 'absolute', right: 0, top: 0 }}>
              <FlatButton
                onClick={this.handleTouchTap}
                style={{ height: 48, paddingLeft: 16, paddingRight: 16, marginTop: 8 }}
              >
                <UserAvatar
                  user={{ profile: avatar, firstName, lastName }}
                  style={{ float: 'left' }}
                />
                <div className="nameContainerHeader">
                  <div className="userNameHeader">{firstName}</div>
                  <Icon name="chevron-down" fill="white" style={{ height: 12, width: 12, marginBottom: -2 }} />
                </div>
              </FlatButton>
              <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                onRequestClose={this.handleRequestClose}
                animation={PopoverAnimationVertical}
                zDepth={2}
                style={{ overflow: 'hidden' }}
              >
                <Menu style={{ backgroundColor: 'white' }}>
                  {
                    menuItemsMap.map((item, i) => (
                      item.component ?
                        item.component.bind(this)() :
                        (
                          <MenuItem
                            key={item.label}
                            primaryText={item.label}
                            rightIconButton={
                              i === 0 ?
                                <IconButton
                                  disableTouchRipple
                                  onClick={this.handleRequestClose}
                                  iconStyle={{
                                    height: 12,
                                    width: 12,
                                    marginLeft: 10,
                                    marginBottom: 12
                                  }}
                                >
                                  <Icon name="chevron-up" />
                                </IconButton>
                                :
                                null
                            }
                            leftIcon={
                              <Icon
                                name={item.iconName}
                                fill={colors.lightGrey}
                                style={{ height: 20, width: 20 }}
                              />
                            }
                            onClick={() => {
                              item.callback.bind(this)();
                              this.setState({ open: false });
                            }}
                            style={{ color: colors.darkGrey, paddingLeft: 10 }}
                          />
                        )
                    ))
                  }
                </Menu>
              </Popover>
            </div>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

Header.propTypes = {
  toggleSideBar: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  wd: PropTypes.object.isRequired
}

export default connect(
  ({ user, windowDimension: wd }) => ({ user, wd }),
  { logoutUser: _logoutUser }
)(Header)
