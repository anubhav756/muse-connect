import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import BigShiftChart from './BigShiftChart';

function BigShiftChartWrapper({ bigShifts, isFetching, style }) {
  const chartData = {};
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - 7);
  _.forEach(bigShifts, ({ id, ...other }) => { chartData[id] = { ...other }; })

  return (
    <div style={style}>
      {
        !isFetching &&
        <div>
          <BigShiftChart
            chartData={chartData}
            style={{ marginTop: 10 }}
          />
          <div className="LabelBigShift">
            {`Week of ${moment(start).format('MMMM Do')} to ${moment(end).format('MMMM Do, YYYY')}`}
          </div>
        </div>
      }
    </div>
  )
}

BigShiftChartWrapper.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  bigShifts: PropTypes.array.isRequired,
  style: PropTypes.object,
}
BigShiftChartWrapper.defaultProps = {
  style: null
}

export default connect(
  ({
    clientList: {
      clients: {
        isFetching,
        info: {
          active_clients: clients
        }
      }
    }
  }) =>
    ({
      isFetching,
      bigShifts: _.map(
        _.filter(
          _.orderBy(clients, o => Math.abs(o.weekly_shift), 'desc'),
          (o) => {
            let displayShift = true
            if (o.weekly_shift > 0 && Math.floor(o.weekly_shift / 60) === 0) {
              displayShift = false
            } else if (o.weekly_shift < 0 && Math.ceil(o.weekly_shift / 60) === 0) {
              displayShift = false
            } else if (o.weekly_shift === 0) {
              displayShift = false
            }
            return displayShift
          }
        ).slice(0, 7),
        o => ({
          id: o.id,
          shift: o.weekly_shift,
          profile: o.avatar,
          firstName: o.first_name,
          lastName: o.last_name
        }))
    })
)(BigShiftChartWrapper);
