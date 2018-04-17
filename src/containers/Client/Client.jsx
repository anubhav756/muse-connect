import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import { getClient as _getClient, getAggregateSessions } from '../../redux/modules/client';

import ClientSidebar from './ClientSidebar'
import ClientSummaryComponent from './ClientSummary'
import ClientNotes from './ClientNotes'
import { cleverTapViewClient } from '../../libs/cleverTap'

import './Client.scss';

const TabsVal = {
  Summary: 'Summary',
  Notes: 'Notes'
}

class Client extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: TabsVal.Summary
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentWillMount() {
    const { clientId } = this.props
    // api call to get client is made here at root wrapper, childs component handle the state only
    // for the same call. Sidebar component and daily session list component shows loader untill api
    // fetches data for client.
    this.props.getClient(clientId);
    this.props.getAggregateSessions(clientId)
    cleverTapViewClient() // cleverTap event
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.clientId !== nextProps.clientId) {
      this.props.getClient(nextProps.clientId);
      this.props.getAggregateSessions(nextProps.clientId)
    }
  }

  handleTabChange(value) {
    this.setState({ selectedTab: value })
  }
  render() {
    // shows the error component if getclientById api get fails or aggregate api get fails
    const { clientId } = this.props
    const { selectedTab } = this.state

    return (
      <div className="containerClient">
        <ClientSidebar />
        <div className="ContentContainerClient">
          <Tabs
            value={selectedTab}
            onChange={this.handleTabChange}
            tabItemContainerStyle={{ borderBottom: `1px solid ${colors.lightestGrey}`, backgroundColor: 'transparent' }}
            contentContainerStyle={{ marginTop: '40px' }}
            inkBarStyle={{ backgroundColor: colors.teal }}
          >
            <Tab
              label="Summary"
              value={TabsVal.Summary}
              style={{
                fontFamily: 'proxima_novasemibold',
                color: selectedTab === TabsVal.Summary ? colors.teal : colors.darkGrey
              }}
            >
              <ClientSummaryComponent
                clientId={clientId}
              />
            </Tab>
            <Tab
              label="Notes"
              value={TabsVal.Notes}
              style={{
                fontFamily: 'proxima_novasemibold',
                color: selectedTab === TabsVal.Notes ? colors.teal : colors.darkGrey
              }}
            >
              {
                (selectedTab === TabsVal.Notes) &&
                <ClientNotes
                  clientId={clientId}
                />
              }
            </Tab>
          </Tabs>
        </div>
      </div >
    );
  }
}
Client.propTypes = {
  clientId: PropTypes.string.isRequired,
  getClient: PropTypes.func.isRequired,
  getAggregateSessions: PropTypes.func.isRequired,
}

Client.defaultProps = {
  errorText: 'An unexpected error occurred.'
}

export default connect(
  ({ routing }) => ({
    clientId: routing.locationBeforeTransitions.pathname.split('/')[2],
  }),
  { getClient: _getClient, getAggregateSessions }
)(Client);
