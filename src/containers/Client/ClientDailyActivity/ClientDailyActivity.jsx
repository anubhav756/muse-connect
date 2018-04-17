import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import InfiniteScrollLoader from '../../../components/InfiniteScrollLoader';
import ClientDailyActivityList from './ClientDailyActivityList'
import { getDailySessions } from '../../../redux/modules/client'
import NoResultFound from '../../../components/NoResultFoundCard'

export class ClientDailyActivity extends Component {

  constructor(props) {
    super(props)
    this._loadMoreSessions = this._loadMoreSessions.bind(this)
    this.state = {
      displayedSessions: []
    }
  }

  componentWillMount() {
    const { clientId } = this.props
    this.props.getDailySessions(clientId, 0)
  }

  _loadMoreSessions() {
    const { dailySessions: { info: { sessions } }, clientId } = this.props
    this.setState({ displayedSessions: sessions }, () => {
      const { displayedSessions } = this.state
      if (sessions.length === displayedSessions.length) {
        this.props.getDailySessions(clientId, sessions.length)
      }
    })
  }

  render() {
    const { dailySessions: { isFetching, info: { sessions } },
      client,
      aggregateSessions
    } = this.props
    const { displayedSessions } = this.state

    if (!sessions || !sessions.length) {
      return (
        <div>
          <div style={{ marginTop: '30px' }}>
            <NoResultFound text="No session found" />
          </div>
        </div>
      )
    }

    const hasMore = sessions.length - displayedSessions.length > 0
    return (
      <div>
        <InfiniteScroll
          loadMore={this._loadMoreSessions}
          hasMore={hasMore}
          threshold={10}
        >
          <div>
            <ClientDailyActivityList
              sessions={sessions}
              client={client}
              aggregateSessions={aggregateSessions}
            />
            <InfiniteScrollLoader loading={isFetching} style={{ marginTop: 30 }} />
          </div>
        </InfiniteScroll>
      </div>
    )
  }
}

ClientDailyActivity.propTypes = {
  dailySessions: PropTypes.object.isRequired,
  getDailySessions: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
  aggregateSessions: PropTypes.object.isRequired
}

export default connect(null, { getDailySessions })(ClientDailyActivity)
