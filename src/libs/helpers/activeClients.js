import _ from 'lodash';
import _moment from 'moment';
import { extendMoment } from 'moment-range';
import { getFirstLastDay, getDifferenceBetweenDates, getStartTime, getEndTime } from './common';

const moment = extendMoment(_moment);

/**
 * Calculates graph data for days/week/month modes (only within the start/end date ranges)
 * @param {Array} __aggregateSessions Raw array of sessions
 * with datetime and calm/neutral/active times
 * @param {Date} _startDate start date of the graph's scope
 * @param {Date} _endDate end date of the graph's scope
 * @param {Boolean} allClients if true, reads the key for allClients API only
 * @param {Function} done callback with calculated aggregate Weeks/Months
 * @param {Boolean} calculateDaysData when true, aggregates session data
 * (without limits) daywise too
 * @return {Null} null
 */
export default function calculateAggregateData(
  __aggregateSessions = [],
  _startDate = null,
  _endDate = new Date(),
  allClients,
  done,
  calculateDaysData
) {
  const startDate = getStartTime(_startDate);
  const endDate = getEndTime(_endDate);
  const _aggregateSessions = _.map(__aggregateSessions,
    o => ({ ...o, datetime: allClients ? o.date : o.datetime }));
  let aggregateSessions = _.sortBy(_aggregateSessions, ({ datetime }) => new Date(datetime));
  let startIndex = -1;
  let endIndex = -1;

  _.forEach(aggregateSessions, ({ datetime }, i) => {
    const _date = new Date(datetime);
    if (startDate >= _date)
      startIndex = i;
    if (endDate >= _date)
      endIndex = i;
  })
  aggregateSessions = _.reverse(aggregateSessions.slice(startIndex + 1, endIndex + 1));

  const aggregateDays = calculateDaysData ? _.reduce(_aggregateSessions, (result, {
    datetime,
    total_time,
    seconds_calm,
    seconds_neutral,
    seconds_active,
    noHeadband
  }) => {
    const _date = new Date(datetime);
    _date.setHours(0, 0, 0, 0);
    const _dateString = _date.toISOString();
    return {
      ...result,
      [_dateString]: allClients ?
        (result[_dateString] || 0) + total_time :
        (result[_dateString] || []).concat({
          seconds_calm,
          seconds_neutral,
          seconds_active,
          noHeadband
        })
    }
  }, {}) :
    null;

  const activeDays = calculateDaysData ? _.uniq(
    _.map(aggregateSessions, ({ datetime }) => ((new Date(datetime)).getDate()))
  ).length :
    null;

  const aggregateWeeks = _.reduce(aggregateSessions, (result, {
    datetime,
    total_time,
    seconds_calm,
    seconds_neutral,
    seconds_active: _seconds_active,
    noHeadband: _noHeadband
  }) => {
    let noHeadband = 0
    let seconds_active = _seconds_active
    if (_noHeadband) {
      noHeadband = seconds_active;
      seconds_active = 0;
    }
    const _date = new Date(datetime);
    const weekNumber = Math.floor(getDifferenceBetweenDates(_date, endDate) / 7) + 1;
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + (7 * weekNumber));
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    const weekRange = moment.range(
      startDate > start ? startDate : start,
      endDate < end ? endDate : end
    ).toString();
    const totalTime = allClients ?
      total_time :
      seconds_calm + seconds_neutral + seconds_active + noHeadband;
    const prevResult = result[weekRange] || {
      seconds_calm: 0,
      seconds_neutral: 0,
      seconds_active: 0,
      noHeadband: 0
    }
    return {
      ...result,
      [weekRange]: allClients ?
        (result[weekRange] || 0) + totalTime : {
          seconds_calm: prevResult.seconds_calm + seconds_calm,
          seconds_neutral: prevResult.seconds_neutral + seconds_neutral,
          seconds_active: prevResult.seconds_active + seconds_active,
          noHeadband: prevResult.noHeadband + noHeadband,
        }
    }
  }, {});

  const aggregateMonths = _.reduce(aggregateSessions, (result, {
    datetime,
    total_time,
    seconds_calm,
    seconds_neutral,
    seconds_active: _seconds_active,
    noHeadband: _noHeadband
  }) => {
    let noHeadband = 0
    let seconds_active = _seconds_active
    if (_noHeadband) {
      noHeadband = seconds_active;
      seconds_active = 0;
    }
    const { startDate: start, endDate: end } = getFirstLastDay(new Date(datetime));
    const monthRange = moment.range(
      startDate > start ? startDate : start,
      endDate < end ? endDate : end
    ).toString();
    const totalTime = allClients ?
      total_time :
      seconds_calm + seconds_neutral + seconds_active + noHeadband;
    const prevResult = result[monthRange] || {
      seconds_calm: 0,
      seconds_neutral: 0,
      seconds_active: 0,
      noHeadband: 0
    }
    return {
      ...result,
      [monthRange]: allClients ?
        (result[monthRange] || 0) + totalTime : {
          seconds_calm: prevResult.seconds_calm + seconds_calm,
          seconds_neutral: prevResult.seconds_neutral + seconds_neutral,
          seconds_active: prevResult.seconds_active + seconds_active,
          noHeadband: prevResult.noHeadband + noHeadband,
        }
    }
  }, {});

  done({
    aggregateDays,
    aggregateWeeks,
    aggregateMonths,
    activeDays
  })
}
