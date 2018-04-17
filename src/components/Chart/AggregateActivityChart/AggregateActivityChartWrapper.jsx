import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker,
  CircularProgress,
  FloatingActionButton
} from 'material-ui';
import { connect } from 'react-redux';
import _moment from 'moment';
import { extendMoment } from 'moment-range';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import { getDifferenceBetweenDates } from '../../../libs/helpers/common'
import Icon from '../../Icon';
import AggregateActivityChart from './AggregateActivityChart';

const moment = extendMoment(_moment);

export const DAILY_CHART_SCOPE = 'DAILY_CHART_SCOPE';
export const WEEKLY_CHART_SCOPE = 'WEEKLY_CHART_SCOPE';
export const MONTHLY_CHART_SCOPE = 'MONTHLY_CHART_SCOPE';

const chartScopeToLabelsMap = {
  [DAILY_CHART_SCOPE]: 'Daily',
  [WEEKLY_CHART_SCOPE]: 'Weekly',
  [MONTHLY_CHART_SCOPE]: 'Monthly'
}

class AggregateActivityChartWrapper extends Component {
  constructor(props) {
    super(props);

    const { showAllClients, allClients, clientSession } = props;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const prevMonth = new Date(now.getTime());
    prevMonth.setMonth(prevMonth.getMonth() - 1);

    this.state = {
      chartScope: DAILY_CHART_SCOPE,
      chartRange: moment.range(prevMonth, now),
      isFetching: showAllClients ? allClients.isFetching : clientSession.isFetching,
      portableMode: false
    }
  }
  componentDidMount() {
    if (document.getElementById('ChartControlsAggregateActivityChart').offsetWidth < 432)
      this.portableMode();
  }
  componentWillReceiveProps({
    showAllClients,
    clientSession: nextClientSession,
    allClients: nextAllClients
  }) {
    const { clientSession, allClients } = this.props;

    if (showAllClients && allClients.isFetching && !nextAllClients.isFetching)
      this.setState({ isFetching: false });
    else if (!showAllClients && clientSession.isFetching && !nextClientSession.isFetching)
      this.setState({ isFetching: false });
  }
  getChartData() {
    const {
      showAllClients,
      clientSession: {
         info: singleClientDetails
      },
      allClients: {
          info: allClientDetails
        }
    } = this.props;
    const rawData = showAllClients ?
      allClientDetails.client_activity :
      singleClientDetails.aggregateSessions;
    const dailyData = showAllClients ?
      allClientDetails.aggregateDays :
      singleClientDetails.aggregateDays
    return { dailyData, rawData };
  }
  portableMode() {
    this.setState({ portableMode: true });
  }
  shiftChartBackward() {
    const { chartRange } = this.state;
    const days = Array.from(chartRange.by('day', { exclusive: true }));
    const newStart = chartRange.start.toDate();
    newStart.setDate(newStart.getDate() - days.length);
    const newRange = moment.range(newStart, chartRange.start.toDate());

    this.setState({
      chartRange: newRange
    });
  }
  shiftChartForward() {
    const { chartRange } = this.state;
    const days = Array.from(chartRange.by('day', { exclusive: true }));
    const newEnd = chartRange.end.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let newRange = null;
    newEnd.setDate(newEnd.getDate() + days.length);
    if (newEnd > today) {
      const datesDiff = getDifferenceBetweenDates(newEnd, today, 'day');
      const newStart = chartRange.start.toDate();
      newStart.setDate(newStart.getDate() + (days.length - datesDiff));
      newRange = moment.range(newStart, today);
    } else
      newRange = moment.range(chartRange.end.toDate(), newEnd);

    this.setState({
      chartRange: newRange
    });
  }
  handleDateChange(name, newDate) {
    const { chartRange } = this.state;
    let newRange = null;
    if (name === 'from')
      newRange = moment.range(newDate, chartRange.end);
    else
      newRange = moment.range(chartRange.start, newDate);

    this.setState({
      chartRange: newRange
    })
  }
  renderChartScopeButton(value) {
    if (this.state.chartScope === value)
      return (
        <div
          key={value}
          className="ChartScopeBtnSelectedAggregateActivityChart"
        >
          {chartScopeToLabelsMap[value]}
        </div>
      );
    return (
      <div
        key={value}
        onClick={() => this.setState({ chartScope: value })}
        className="ChartScopeBtnAggregateActivityChart"
      >
        {chartScopeToLabelsMap[value]}
      </div>
    );
  }
  renderDatePicker(name, value) {
    const { isFetching, chartRange } = this.state;
    const innerStart = chartRange.start.toDate();
    const innerEnd = chartRange.end.toDate();
    innerStart.setDate(innerStart.getDate() + 1);
    innerEnd.setDate(innerEnd.getDate() - 1);
    return (
      <DatePicker
        autoOk
        name={name}
        value={value}
        hideCalendarDate
        container="inline"
        disabled={isFetching}
        formatDate={date => moment(date).format('MMM D, YYYY')}
        onChange={(e, date) => this.handleDateChange(name, date)}
        style={{ display: 'inline-block' }}
        textFieldStyle={{ fontSize: 12, width: 70, cursor: isFetching ? 'not-allowed' : 'pointer' }}
        minDate={name === 'to' ? innerStart : null}
        maxDate={name === 'from' ? innerEnd : new Date()}
      />
    );
  }
  render() {
    const { showAllClients, chartHeight, className } = this.props;
    const { chartRange, isFetching, chartScope, portableMode } = this.state;
    return (
      <div className={className}>
        <div id="ChartControlsAggregateActivityChart" className="clearfix">
          <div className="ChartScopeBtnGroupAggregateActivityChart">
            {
              [
                DAILY_CHART_SCOPE,
                WEEKLY_CHART_SCOPE,
                MONTHLY_CHART_SCOPE
              ].map(scope => this.renderChartScopeButton(scope))
            }
          </div>
          <div
            className={`DateContainerAggregateActivityChart ${portableMode ? 'PortableDateAggregateActivityChart' : ''}`}
          >
            <div className="ChartDurationLabelAggregateActivityChart">From</div>
            {this.renderDatePicker('from', chartRange.start.toDate())}
            <div className="ChartDurationLabelAggregateActivityChart">To</div>
            {this.renderDatePicker('to', chartRange.end.toDate())}
          </div>
        </div>
        {
          isFetching ?
            <center style={{ marginTop: 125 }}><CircularProgress /></center> :
            <div style={{ height: chartHeight, position: 'relative' }}>
              <FloatingActionButton
                zDepth={0}
                backgroundColor={colors.mediumGrey}
                iconStyle={{ height: 20, width: 20 }}
                onClick={() => this.shiftChartBackward()}
                style={{ position: 'absolute', top: 58, left: -24 }}
              >
                <Icon name="chevron-left" fill="white" style={{ height: 14, width: 14, marginTop: 3, marginRight: 1 }} />
              </FloatingActionButton>
              <AggregateActivityChart
                chartData={this.getChartData()}
                chartScope={chartScope}
                chartRange={chartRange}
                showAllClients={showAllClients}
                style={{ marginTop: 26 }}
                chartHeight={chartHeight}
              />
              <FloatingActionButton
                zDepth={0}
                backgroundColor={colors.mediumGrey}
                iconStyle={{ height: 20, width: 20 }}
                disabled={
                  chartRange.end.toDate().setHours(0, 0, 0, 0) >=
                  (new Date()).setHours(0, 0, 0, 0)
                }
                onClick={() => this.shiftChartForward()}
                style={{ position: 'absolute', top: 58, right: -20 }}
              >
                <Icon name="chevron-right" fill="white" style={{ height: 14, width: 14, marginTop: 3, marginLeft: 1 }} />
              </FloatingActionButton>
            </div>
        }
      </div>
    )
  }
}

AggregateActivityChartWrapper.propTypes = {
  showAllClients: PropTypes.bool,
  clientSession: PropTypes.object.isRequired,
  allClients: PropTypes.object.isRequired,
  chartHeight: PropTypes.number,
  className: PropTypes.string
}
AggregateActivityChartWrapper.defaultProps = {
  showAllClients: false,
  chartHeight: 230,
  className: null
}

export default connect(
  ({ client: { aggregateSessions }, allClients }) =>
    ({ clientSession: aggregateSessions, allClients })
)(AggregateActivityChartWrapper);
