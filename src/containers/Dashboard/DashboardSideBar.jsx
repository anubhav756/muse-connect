import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  List,
  ListItem
} from 'material-ui'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import './DashboardSideBar.scss';
import Sidebar from '../../components/Sidebar'
import AddClient from '../../components/AddClient'
import UserAvatar from '../../components/UserAvatar'
import { ClientsSortBy } from '../../components/SelectDropDown'
import { redirectToProfile } from '../../libs/helpers/redirect'
import { DESKTOP_VIEW } from '../../libs/helpers/windowDimension'
import {
  setSortByColumn as _setSortByColumn,
  setStatusFilter as _setStatusFilter
} from '../../redux/modules/clientList'
import { ACCEPTED, CLIENT_NAME } from '../../libs/helpers/clientList';
import TutorialPopover from '../../components/TutorialPopover';
import { TutorialCards } from '../../redux/modules/tutorialCard'

const listSubheadingStyle = { fontFamily: 'proxima_novaregular', color: colors.mediumGrey, fontSize: 12 }
const lightListSubheadingStyle = { fontFamily: 'proxima_novaregular', color: colors.lightGrey, fontSize: 12 }
const filterLabelStyle = { display: 'inline-block', verticalAlign: 'top', marginTop: 16, marginRight: 10, fontSize: '13px' }
const dropDownLabelStyle = { color: colors.teal, paddingRight: '15px', fontWeight: '600' }
const selectedMenuItemStyle = { color: colors.teal }
const dropDownStyle = { width: '180px', fontSize: '13px' }
const iconStyle = { right: '-15px', fill: colors.mediumGrey, viewBox: '0 0 18 18' }
const menuItemStyle = { color: colors.darkGrey, fontSize: '14px' }

export class DashBoardSideBar extends Component {
  componentWillMount() {
    const {
      clientList: {
        sortByColumn,
      statusFilter,
      },
      setSortByColumn,
      setStatusFilter
    } = this.props;

    if (statusFilter !== ACCEPTED)
      setStatusFilter(ACCEPTED);
    if (sortByColumn !== CLIENT_NAME)
      setSortByColumn(CLIENT_NAME);
  }
  render() {
    const {
      tutorial,
      windowDimension,
      clientList: {
        displayList,
        sortByColumn,
        clients: {
          isFetching,
          info
        }
      },
      setSortByColumn
    } = this.props;

    const showTutorial = tutorial && tutorial.tutorialCards[TutorialCards.dashboardSideBar]
    const activeClientsLength = (info.active_clients && info.active_clients.length) || 0;
    const zeroState = (activeClientsLength === 0)

    return (
      <Sidebar title="Client List" loading={isFetching}>
        <div>
          {
            showTutorial && DESKTOP_VIEW(windowDimension) &&
            <div className="tutorialSideBarDashboard">
              <TutorialPopover
                keyName={showTutorial}
                title="Your Clients"
                preferPlace="below"
                text="Add clients to Muse Connect by clicking on the green plus symbols, and your clients will be listed here. You can sort the list according to different filters to give you a quick view of your practice."
              />
            </div>
          }
          <div style={filterLabelStyle}>Sort by </div>
          <ClientsSortBy
            style={dropDownStyle}
            selectedMenuItemStyle={selectedMenuItemStyle}
            labelStyle={dropDownLabelStyle}
            menuItemStyle={menuItemStyle}
            iconStyle={iconStyle}
            callBack={setSortByColumn}
            SortByVal={sortByColumn}
            className="dropDownSideBarDashboard"
          />
          <List style={{ marginLeft: -18 }}>
            {
              zeroState ?
                [0, 1, 2, 3].map(o => (
                  <ListItem
                    key={o}
                    disableTouchRipple
                    style={{ color: colors.mediumGrey, fontFamily: 'proxima_novaregular', paddingLeft: 12 }}
                    innerDivStyle={{ paddingTop: 10, paddingBottom: 10 }}
                    leftAvatar={<UserAvatar style={{ top: 8 }} />}
                    primaryText="Client Name"
                    secondaryText={
                      <div style={lightListSubheadingStyle}>
                        {'X active days this week'}
                      </div>
                    }
                  />
                )) :
                displayList.map(client => (
                  <ListItem
                    key={client.id || client.email}
                    style={{ color: colors.darkGrey, fontFamily: 'proxima_novasemibold', paddingLeft: 12 }}
                    innerDivStyle={{ paddingTop: 10, paddingBottom: 10 }}
                    onClick={() => redirectToProfile(client.id)}
                    leftAvatar={<UserAvatar user={client} style={{ top: 8 }} />}
                    primaryText={`${client.first_name} ${client.last_name}`}
                    secondaryText={
                      <div style={listSubheadingStyle}>
                        {
                          client ?
                            `${client.sessions_number} active day${client.sessions_number === 1 ? '' : 's'} this week` :
                            '0 active days this week'
                        }
                      </div>
                    }
                  />
                ))
            }
          </List>
        </div>
        <center
          style={{ marginLeft: -18, marginTop: 30 }}
        >
          <AddClient
            show={!isFetching}
          />
        </center>
      </Sidebar>
    )
  }
}

DashBoardSideBar.propTypes = {
  windowDimension: PropTypes.object.isRequired,
  clientList: PropTypes.object.isRequired,
  setSortByColumn: PropTypes.func.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  tutorial: PropTypes.object.isRequired
}

export default connect(
  ({ clientList, windowDimension, tutorial }) => ({ clientList, windowDimension, tutorial }), ({
    setSortByColumn: _setSortByColumn,
    setStatusFilter: _setStatusFilter
  })
)(DashBoardSideBar)
