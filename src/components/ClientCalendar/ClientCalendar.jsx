import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Calendar from './CustomCalendar'
import { getFirstLastDay, getFirstDay, normaliseSeconds } from '../../libs/helpers/common'

import './ClientCalendar.scss'

export class ClientCalendar extends Component {
  constructor(props) {
    super(props)
    this.handleMonthChange = this.handleMonthChange.bind(this)
    this.checkSessions = this.checkSessions.bind(this)
    this.state = {
      sessionCount: 0,
      duration: 0,
      setValues: true
    }
    // used to update the final set value at sessionCount at state of component
    this.sessionCount = 0
    // used to update the final set value at duration at state of component
    this.duration = 0
    // keep track of how many request for sessions to store has made from component
    this.callCount = 0
  }

  componentWillMount() {
    const date = new Date()
    this.handleMonthChange(date)
  }

  handleMonthChange(date) {
    // sets session count to 0 as details for different month is requested
    const { startDate, endDate } = getFirstLastDay(date)
    // sets session count to 0 as details for different month is requested
    this.sessionCount = 0
    this.duration = 0
    this.setState({ startDate,
      endDate,
      sessionCount: this.sessionCount,
      duration: this.duration,
      setValues: true })
  }

  /*
   * @function checkSessions
   * @param {dates} date stores the current date processed by plugin.
   * @returns bool true makes date disable in our case it means user has taken session on this date
   * @memberOf ClientCalendar
   */
  checkSessions(date) {
    const { info: { aggregateDays } } = this.props.clientSession || {}
    const { endDate, setValues } = this.state
    // setHours to (0,0,0,0) to make date comparable
    endDate.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    if (date.getTime() === getFirstDay(date).getTime()) {
      this.sessionCount = 0
      this.duration = 0
    }
    let status = false // default
    // true if user has taken session
    if (aggregateDays[date.toISOString()]) {
      // increase count
      const dayDetails = aggregateDays[date.toISOString()] || []
      let duration = 0
      dayDetails.forEach((dayDetail) => {
        duration += (dayDetail.seconds_active +
        dayDetail.seconds_neutral +
        dayDetail.seconds_calm)
        || 0
      })
      this.sessionCount += 1
      this.duration += duration
      status = true
    }
    // if last date of month then updates the sessionCount and duration
    if (endDate.getTime() === date.getTime() && setValues) {
      const { hour, min } = normaliseSeconds(this.duration)
      const hDisplay = hour > 0 ? `${hour}hr ` : ''
      const mDisplay = min > 0 ? `${min}min ` : ''
      // in current tick render is been running
      setTimeout(() => {
        this.setState({ sessionCount: this.sessionCount, duration: `${hDisplay}${mDisplay}`, setValues: false })
      }, 0)
    }
    return status
  }

  render() {
    const True = true
    const { sessionCount, duration } = this.state
    const { isError, isFetching } = this.props.clientSession
    return (
      <div className={'calendarClient'} >
        <Calendar
          ref={'calendar'}
          firstDayOfWeek={1}
          hideCalendarDate={True}
          onMonthChange={this.handleMonthChange}
          shouldDisableDate={this.checkSessions}
          isFetching={isFetching}
          isError={isError}
        />
        <div className="sessionDetailsCal">
          {
          !isFetching && !isError &&
            <div>
              <div className="sessionHeadingCal">{"This month's highlights:"}</div>
              <div className="sessionItemsWrapperCal">
                <div style={{ display: 'inline-block', width: '40%' }}>
                  <div className="sessionItemCal">{sessionCount}</div>
                  <div className="sessionItemTextCal">Days this month</div>
                </div>
                <div className="sessionItemWrapperCal">
                  <div className="sessionItemCal">{duration || 0}</div>
                  <div className="sessionItemTextCal">Total time this month</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

ClientCalendar.propTypes = {
  clientSession: PropTypes.object.isRequired
}

function mapStateToProps({ client }) {
  return { clientSession: client.aggregateSessions }
}

export default connect(mapStateToProps)(ClientCalendar)
