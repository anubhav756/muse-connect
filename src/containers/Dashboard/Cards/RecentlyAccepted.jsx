import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import {
  Paper,
} from 'material-ui'

import CardHeadingWithDivider from '../../../components/CardHeadingWithDivider'
import Loader from '../../../components/Loader/ContentLoader'
import ListItem from '../../../components/ClientListItem'
import { CLIENT_SINCE, applySort } from '../../../libs/helpers/clientList'
import NoResultFound from '../../../components/NoResultFoundCard'
import { redirectToProfile } from '../../../libs/helpers/redirect'
import './RecentlyAccepted.scss'

export class RecentAccepted extends Component {
  constructor(props) {
    super(props)
    this._getRecentAcceptedClients = this._getRecentAcceptedClients.bind(this)
    this.state = {
      RecentAcceptedClients: []
    }
  }

  componentWillMount() {
    const { clients } = this.props.clientList || {}
    const { isFetching, info } = clients || {}
    if (!isFetching && info && info.active_clients) {
      this._getRecentAcceptedClients(info.active_clients)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { RecentAcceptedClients } = this.state
    if (_.isEmpty(RecentAcceptedClients)) {
      const { clients } = nextProps.clientList || {}
      const { isFetching, info } = clients || {}
      if (!isFetching && info && info.active_clients) {
        this._getRecentAcceptedClients(info.active_clients)
      }
    }
  }

  _getRecentAcceptedClients(clientList = []) {
    const sortedList = applySort(clientList, CLIENT_SINCE) || []
    const displayList = sortedList.slice(0, 4)
    const True = true
    const displayItems = displayList.map(listItem => (
      <div key={listItem.id} className="listItemWrapRecentAcceptedDashboard" onClick={() => redirectToProfile(listItem.id)}>
        <div style={{ paddingTop: '25px' }}>
          <ListItem
            heading={`${listItem.first_name} ${listItem.last_name}`}
            dividerClassName="listItemRecentAcceptedDashboard"
            subHeading={`Added on ${listItem.accepted_date && moment(listItem.accepted_date).format('MMMM D, Y')}`}
            listItemBodyStyle={{ paddingTop: '0px', paddingBottom: '0px' }}
            user={{
              firstName: listItem.first_name,
              lastName: listItem.last_name,
              profile: listItem.avatar
            }}
            divider={True}
            dividerStyle={{ marginTop: '25px' }}
          />
        </div>
      </div>
    ))
    this.setState({ RecentAcceptedClients: displayItems })
  }

  render() {
    const { clients } = this.props.clientList || {}
    const { isFetching } = clients || {}
    const { RecentAcceptedClients } = this.state
    return (
      <Paper rounded={false} className="wrapRecentAcceptedDashboard">
        {
          isFetching
          ? <Loader zDepth={0} />
          : <div className="containerRecentAcceptedDashboard">
            <CardHeadingWithDivider dividerClassName={'dividerRecentAcceptedDashboard'} text={'Recently accepted'} dividerStyle={{ marginTop: '31px' }} />
            <div>
              {
                _.isEmpty(RecentAcceptedClients)
                  ? <NoResultFound text={'None recently accepted'} zDepth={0} style={{ textAlign: 'left' }} />
                  : RecentAcceptedClients
              }
            </div>
          </div>
        }
      </Paper>
    )
  }
}

function mapStateToProps({ clientList }) {
  return { clientList }
}

export default connect(mapStateToProps)(RecentAccepted)

RecentAccepted.propTypes = {
  clientList: PropTypes.object.isRequired
}
