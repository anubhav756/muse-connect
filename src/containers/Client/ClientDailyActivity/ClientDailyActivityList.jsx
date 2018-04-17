import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ClientSessionCard from './ClientSessionCard'

import { areInSameDay } from '../../../libs/helpers/common'


export default class ClientDailyActivityList extends Component {
  constructor(props) {
    super(props)
    this.getSessionCards = this.getSessionCards.bind(this)
    this.displayDate = false
    this.getActiveNeutralCalmTime = this.getActiveNeutralCalmTime.bind(this)
  }

  getActiveNeutralCalmTime(id) {
    const { aggregateSessions } = this.props
    const allSessions = (
      aggregateSessions &&
      aggregateSessions.info &&
      aggregateSessions.info.aggregateSessions
    ) || []
    const index = _.findIndex(allSessions, ['id', id])
    if (index !== -1) {
      return allSessions[index]
    }
    return {}
  }

  getSessionCards(sessions, client) {
    const sessionItems = []
    sessions.forEach((session) => {
      const { datetime } = session
      const sessionDetails = this.getActiveNeutralCalmTime(session.id)
      const _sessionDetails = {}
      if (!_.isEmpty(sessionDetails)) {
        _sessionDetails.calmTime = sessionDetails.seconds_calm
        _sessionDetails.activeTime = sessionDetails.seconds_active
        _sessionDetails.neutralTime = sessionDetails.seconds_neutral
      }
      const showDate = this.displayDate ? (!areInSameDay(this.displayDate, datetime)) : true
      if (showDate) {
        this.displayDate = datetime
      }
      sessionItems.push(
        <div style={{ marginTop: '18px' }} key={session.id}>
          <ClientSessionCard
            session={session}
            client={client}
            showDate={showDate}
            {..._sessionDetails}
          />
        </div>
      )
    })
    this.displayDate = false
    return sessionItems
  }

  render() {
    const { sessions, client } = this.props
    return (
      <div>
        {
        sessions &&
        sessions.length
        ? <div>
          {
            this.getSessionCards(sessions, client)
          }
        </div>
        : ''
        }
      </div>
    )
  }
}

ClientDailyActivityList.propTypes = {
  sessions: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  aggregateSessions: PropTypes.object.isRequired
}
