import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import {
  getClientsList as _getClientsList
} from '../../redux/modules/clientList'
import { fetchAllClientSessions as _getAllClientSessions } from '../../redux/modules/dashboard/allClients'
import ActiveClientCard from './Cards/ActiveClients'
import NoResultFound from '../../components/NoResultFoundCard'
import ClientActivityCard from './Cards/ClientActivity'
import RecentActivityCard from './Cards/RecentActivity'
import PendingClientCard from './Cards/PendingClient'
import RecentAcceptedCard from './Cards/RecentlyAccepted'
import BigShiftCard from './Cards/BigShift'
import HeadBandCard from './Cards/HeadBand'
import LearnCard from './Cards/Learn'
import PageTitle from '../../components/PageTitle'

import './DashboardContent.scss'

class DashboardContent extends Component {

  componentWillMount() {
    const { getClientsList, getAllClientSessions } = this.props;
    getClientsList(true);
    getAllClientSessions()
  }

  render() {
    const { isErrorAllClients, isErrorClientList, clientsCount, activeClientsCount } = this.props
    const showDetails = clientsCount >= 1
    const zeroState = clientsCount === 0
    const showActiveClientCard = activeClientsCount > 0
    return (
      <div>
        {
          isErrorAllClients || isErrorClientList
            ? <div style={{ paddingTop: '34px' }}>
              <NoResultFound text={'Something went wrong while loading details...'} />
            </div>
            : <div>
              <Row>
                <Col xs={12}>
                  <PageTitle className="titleDashboard" text="Dashboard" />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="CardContainerDashboard">
                  <ActiveClientCard showDetails={showActiveClientCard} />
                </Col>
              </Row>
              <Row className="cardWrapperDashboard">
                <Col xs={12} md={showDetails ? 9 : 12} className="CardContainerDashboard">
                  <ClientActivityCard />
                </Col>
                {
                  showDetails &&
                  <Col xs={12} md={3} className="CardContainerDashboard">
                    <RecentActivityCard />
                  </Col>
                }
              </Row>
              <div>
                <Row>
                  <Col xs={12} md={6} className="CardItemsDashboard">
                    <BigShiftCard />
                  </Col>
                  <Col xs={12} md={6} className="CardItemsDashboard">
                    <PendingClientCard />
                  </Col>
                  {
                    !zeroState &&
                    <Col xs={12} md={6} className="CardItemsDashboard">
                      <RecentAcceptedCard />
                    </Col>
                  }
                  <Col xs={12} md={6} className="CardItemsDashboard">
                    <div style={{ margin: '-15px -5px' }}>
                      <HeadBandCard />
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="CardItemsDashboard">
                    <LearnCard />
                  </Col>
                </Row>
              </div>
            </div>
        }
      </div>
    );
  }
}

// all clients handles the client aggregate api response and state
function mapStateToProps({ clientList, allClients }) {
  const isErrorAllClients = allClients && allClients.isError
  const { clients } = clientList || {}
  const isErrorClientList = clients.isError
  const clientsCount = (clients && clients.info && clients.info.clients_count) || 0
  const activeClientsCount = (clients && clients.info && clients.info.active_clients && clients.info.active_clients.length) || 0
  return {
    isErrorAllClients,
    isErrorClientList,
    clientsCount,
    activeClientsCount
  }
}

export default connect(mapStateToProps, {
  getClientsList: _getClientsList,
  getAllClientSessions: _getAllClientSessions
})(DashboardContent)

DashboardContent.propTypes = {
  clientsCount: PropTypes.number.isRequired,
  isErrorAllClients: PropTypes.bool.isRequired,
  isErrorClientList: PropTypes.bool.isRequired,
  getClientsList: PropTypes.func.isRequired,
  getAllClientSessions: PropTypes.func.isRequired,
  activeClientsCount: PropTypes.number.isRequired
}
