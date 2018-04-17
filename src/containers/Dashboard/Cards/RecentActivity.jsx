import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Paper,
} from 'material-ui';
import _ from 'lodash'
import moment from 'moment'
import CardHeadingWithDivider from '../../../components/CardHeadingWithDivider'
import Loader from '../../../components/Loader/ContentLoader'
import ListItem from '../../../components/ClientListItem'
import { LAST_SESSION, applySort } from '../../../libs/helpers/clientList'
import NoResultFound from '../../../components/NoResultFoundCard'
import { redirectToProfile } from '../../../libs/helpers/redirect'
import './RecentActivity.scss'

export class RecentActivity extends Component {
  constructor(props) {
    super(props)
    this._getRecentActivityItems = this._getRecentActivityItems.bind(this)
    this.state = {
      RecentActivityItems: []
    }
  }

  componentWillMount() {
    const { clients } = this.props.clientList || {}
    const { isFetching, info } = clients || {}
    if (!isFetching && info && info.active_clients) {
      this._getRecentActivityItems(info.active_clients)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { RecentActivityItems } = this.state
    if (_.isEmpty(RecentActivityItems)) {
      const { clients } = nextProps.clientList || {}
      const { isFetching, info } = clients || {}
      if (!isFetching && info && info.active_clients) {
        this._getRecentActivityItems(info.active_clients)
      }
    }
  }

  _getRecentActivityItems(clientList = []) {
    const sortedList = applySort(clientList, LAST_SESSION) || []
    const displayList = sortedList.slice(0, 4)
    const displayItems = displayList.map(listItem => (
      <div key={listItem.id} className="listItemWrapClientActivityDashboard" onClick={() => redirectToProfile(listItem.id)}>
        <div style={{ paddingTop: '30px' }}>
          <ListItem
            heading={`${listItem.first_name} ${listItem.last_name}`}
            subHeading={`Last session: ${listItem.last_session ? moment(listItem.last_session).format('MMM. DD') : 'None'}`}
            listItemBodyStyle={{ padding: '0px' }}
          />
        </div>
      </div>
    ))
    this.setState({ RecentActivityItems: displayItems })
  }

  render() {
    const { clients } = this.props.clientList || {}
    const { isFetching } = clients || {}
    const { RecentActivityItems } = this.state
    return (
      <Paper rounded={false} style={{ backgroundColor: 'white', minHeight: '376px' }}>
        {
          isFetching
          ? <Loader zDepth={0} />
          : <div className="containerRecentActivityDashboard">
            <CardHeadingWithDivider dividerClassName={'dividerRecentActivityDashboard'} text={'Recent activity'} />
            <div>
              {
                _.isEmpty(RecentActivityItems)
                  ? <NoResultFound text={'No recent activity'} zDepth={0} style={{ textAlign: 'left' }} />
                  : RecentActivityItems
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

export default connect(mapStateToProps)(RecentActivity)

RecentActivity.propTypes = {
  clientList: PropTypes.object.isRequired
}
