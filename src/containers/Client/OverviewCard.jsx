import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  CircularProgress
} from 'material-ui';

import './OverviewCard.scss'

class OverviewCard extends Component {
  render() {
    const {
      client: {
        isFetching: isFetchingClient,
      info: {
          sessions_number: activeDays,
        session_minutes_avg: avgMinsPerActiveDay,
        session_minutes_total
        }
      },
      aggregateSessions: {
        isFetching: isFetchingAggregateSessions,
        info: {
          active_days: aggregateActiveDays,
          avg_mins_per_active_day: aggregateAvgMinsPerActiveDay,
          avg_active_days_per_week: aggregateAvgActiveDaysPerWeek,
          total_mins: aggregateTotalMins
        }
      }
  } = this.props;

    return (
      <div className={'containerOverviewClient'}>
        <div className={'leftItemOverviewClient'}>
          <div className="CardHeadingClient">
            Past 7 days
           </div>
          {
            isFetchingClient ?
              <div style={{ textAlign: 'center', marginTop: 35, marginBottom: 16 }}>
                <CircularProgress />
              </div> :
              <div style={{ marginTop: 15 }}>
                <div style={{ width: '28%', marginRight: '8%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {activeDays}
                  </div>
                  <div className="DetailClient">Active days</div>
                </div>
                <div style={{ width: '28%', marginRight: '8%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {session_minutes_total}
                  </div>
                  <div className="DetailClient">Total minutes</div>
                </div>
                <div style={{ width: '28%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {avgMinsPerActiveDay}
                  </div>
                  <div className="DetailClient">Avg. minutes per active day</div>
                </div>
              </div>
          }
        </div>
        <div className="rightItemOverviewClient">
          <div className="CardHeadingClient">
            Past 30 days
          </div>
          {
            isFetchingAggregateSessions ?
              <div style={{ textAlign: 'center', marginTop: 35, marginBottom: 16 }}>
                <CircularProgress />
              </div> :
              <div style={{ marginTop: 15 }}>
                <div style={{ width: '22%', marginRight: '4%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {aggregateActiveDays}
                  </div>
                  <div className="DetailClient">Active days</div>
                </div>
                <div style={{ width: '22%', marginRight: '4%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {aggregateTotalMins}
                  </div>
                  <div className="DetailClient">Total minutes</div>
                </div>
                <div style={{ width: '22%', marginRight: '4%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {aggregateAvgActiveDaysPerWeek}
                  </div>
                  <div className="DetailClient">Avg. active days per week</div>
                </div>
                <div style={{ width: '22%', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="LargeNumberTealClient">
                    {aggregateAvgMinsPerActiveDay}
                  </div>
                  <div className="DetailClient">Avg. minutes per active day</div>
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}
OverviewCard.propTypes = {
  client: PropTypes.object.isRequired,
  aggregateSessions: PropTypes.object.isRequired
}

export default connect(({ client, routing }) => ({
  clientId: routing.locationBeforeTransitions.pathname.split('/')[2],
  client: client.client,
  aggregateSessions: client.aggregateSessions
})
)(OverviewCard);
