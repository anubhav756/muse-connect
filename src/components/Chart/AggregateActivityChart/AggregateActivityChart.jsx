import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import _ from 'lodash';
import _moment from 'moment';
import { extendMoment } from 'moment-range';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import calculateAggregateData from '../../../libs/helpers/activeClients';
import { secondsToMinutes } from '../../../libs/helpers/common';
import {
  DAILY_CHART_SCOPE,
  WEEKLY_CHART_SCOPE,
  MONTHLY_CHART_SCOPE
} from './AggregateActivityChartWrapper';

import './AggregateActivityChart.scss';

const moment = extendMoment(_moment);

const scopeToType = {
  DAILY_CHART_SCOPE: 'days',
  WEEKLY_CHART_SCOPE: 'weeks',
  MONTHLY_CHART_SCOPE: 'months'
}

function renderTickMark(tick) {
  const { label, y } = tick;
  return (
    <div
      key={label}
      className="tickContainerAggregateActivityChart"
      style={{ top: y - 16 }}
    >
      {label}
    </div>
  );
}

class AggregateActivityChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chart: null,
      ticks: []
    }
  }
  componentDidMount() {
    this.initializeGraph()
  }
  componentDidUpdate(prevProps) {
    const { chartScope, chartRange } = this.props;
    const { chartScope: prevScope, chartRange: prevRange } = prevProps;

    if (prevScope !== chartScope || prevRange !== chartRange)
      this.initializeGraph();
  }
  componentWillUnmount() {
    const { chart } = this.state;
    if (chart && chart.destroy)
      chart.destroy();
  }
  flatSessionData(data) {
    const { chartRange, showAllClients } = this.props;
    const flatSessionDates = Array.from(chartRange.by('day'));
    const flatSessions = [];
    flatSessionDates.forEach((date) => {
      const _date = date.toDate();
      _date.setHours(0, 0, 0, 0);
      let value = data[_date.toISOString()];
      if (!value)
        value = showAllClients ?
          0 : [];
      else
        value = showAllClients ?
          value : _.map(value, ({ seconds_calm, seconds_neutral, seconds_active, noHeadband }) => ({
            calmTime: seconds_calm,
            neutralTime: seconds_neutral,
            activeTime: seconds_active,
            noHeadband
          }))

      flatSessions.push({
        key: date,
        value
      });
    });
    return flatSessions;
  }
  aggregateChartData(done) {
    const {
      chartScope,
      chartRange,
      chartData: {
        dailyData: _dailyData,
        rawData
      },
      showAllClients
    } = this.props;

    // For tutorial
    if (!rawData)
      return done({
        labels: [],
        datasets: [{
          backgroundColor: colors.cyan,
          hoverBackgroundColor: colors.cyan,
          label: 'Duration',
          data: []
        }]
      });

    const dailyData = this.flatSessionData(_dailyData);

    calculateAggregateData(
      rawData,
      chartRange.start.toDate(),
      chartRange.end.toDate(),
      showAllClients,
      ({ aggregateWeeks, aggregateMonths }) => {
        if (chartScope === DAILY_CHART_SCOPE) {
          if (showAllClients) {
            const filteredChartData = dailyData
            return done({
              labels: _.map(filteredChartData, ({ key }) => key),
              datasets: [{
                backgroundColor: colors.cyan,
                hoverBackgroundColor: colors.cyan,
                label: 'Duration',
                data: _.map(filteredChartData, ({ value }) => value / 60)
              }]
            });
          }

          const labels = [];

          const noHeadbandChartDefaults = {
            backgroundColor: '#ffffff',
            hoverBackgroundColor: '#ffffff',
            borderColor: colors.lightCyan,
            borderWidth: 1,
            label: 'No Headband',
            data: [],
            stack: 0
          }
          const calmChartDefaults = {
            backgroundColor: colors.darkCyan,
            hoverBackgroundColor: colors.darkCyan,
            label: 'Calm',
            data: [],
            stack: 0
          }
          const neutralChartDefaults = {
            backgroundColor: colors.lightCyan,
            hoverBackgroundColor: colors.lightCyan,
            label: 'Neutral',
            data: [],
            stack: 0
          }
          const activeChartDefaults = {
            backgroundColor: 'rgba(81, 189, 236, 0.3)',
            hoverBackgroundColor: 'rgba(81, 189, 236, 0.3)',
            label: 'Active',
            data: [],
            stack: 0
          }

          const datasets = [];

          let i = -1;
          _.forEach(dailyData, ({ key, value }) => {
            i += 1;
            labels.push(key);

            _.forEach(value, (session, stack) => {
              const offset = stack * 4;
              const noHeadband = offset + 3;
              const calm = offset + 0;
              const neutral = offset + 1;
              const active = offset + 2;

              if (!datasets[offset]) {
                datasets[noHeadband] = { ...noHeadbandChartDefaults, data: [], stack }
                datasets[calm] = { ...calmChartDefaults, data: [], stack }
                datasets[neutral] = { ...neutralChartDefaults, data: [], stack }
                datasets[active] = { ...activeChartDefaults, data: [], stack }
              }

              datasets[calm].data[i] = session.calmTime / 60;
              datasets[neutral].data[i] = session.neutralTime / 60;
              datasets[active].data[i] = session.activeTime / 60;

              if (session.noHeadband) {
                datasets[noHeadband].data[i] = session.activeTime / 60;
                datasets[active].data[i] = 0;
              } else {
                datasets[noHeadband].data[i] = 0;
              }
            })
          });
          return done({
            labels,
            datasets
          });
        }
        let labels = [];
        const aggregateData = [];

        _.forEach(
          chartScope === WEEKLY_CHART_SCOPE ? aggregateWeeks : aggregateMonths,
          (value, key) => {
            labels.push(moment.range(key))
            if (showAllClients)
              aggregateData.unshift(value / 60);
            else
              aggregateData.unshift((
                value.seconds_calm +
                value.seconds_neutral +
                value.seconds_active +
                value.noHeadband
              ) / 60);
          }
        )

        labels = _.reverse(labels);

        return done({
          labels,
          datasets: [{
            backgroundColor: colors.cyan,
            hoverBackgroundColor: colors.cyan,
            label: 'Duration',
            data: aggregateData
          }]
        });
      }
    )
  }
  initializeGraph() {
    const { chartScope, chartRange, showAllClients, chartData } = this.props;
    const ctx = document.getElementById('ClientActivityCard-chart').getContext('2d');

    this.aggregateChartData((_data) => {
      const data = { ..._data };

      if (this.state.chart && this.state.chart.destroy)
        this.state.chart.destroy();

      if (
        !data ||
        !data.datasets ||
        !data.datasets.length ||
        !_.filter(data.datasets, ({ data: _datasetData }) =>
          _.filter(_datasetData, val => !!val).length).length
      ) {
        // Zero-state
        return this.setState({ ticks: [] });
      }

      if (!chartData)
        data.labels = Array.from(chartRange.by(scopeToType[chartScope]));

      if (data && data.datasets && !data.datasets.length) {
        data.datasets = [{ data: [], label: '' }];
      }

      this.setState({
        chart: new Chart(ctx, {
          type: 'bar',
          data,
          options: {
            tooltips: {
              callbacks: {
                title(tooltipItem, tooltipData) {
                  if (chartScope === DAILY_CHART_SCOPE)
                    return tooltipData.labels[tooltipItem[0].index].format('MMMM D, YYYY');
                  return `From: ${tooltipData.labels[tooltipItem[0].index].start.format('MMMM D, YYYY')}`;
                },
                afterTitle(tooltipItem, tooltipData) {
                  if (chartScope === DAILY_CHART_SCOPE) {
                    if (showAllClients)
                      return;
                    return `Session ${Math.floor(tooltipItem[0].datasetIndex / 4) + 1}`;
                  }
                  return `To:      ${tooltipData.labels[tooltipItem[0].index].end.format('MMMM D, YYYY')}`;
                },
                label({ datasetIndex, index, yLabel }, { datasets }) {
                  if (showAllClients || chartScope !== DAILY_CHART_SCOPE) {
                    return secondsToMinutes(yLabel * 60, true);
                  }

                  const datasetBase = Math.floor(datasetIndex / 4)
                  const totalTime = _.reduce(
                    datasets.slice(datasetBase * 4, (datasetBase * 4) + 4),
                    (result, value) => result + value.data[index],
                    0
                  )
                  const percent = Math.round((yLabel / (totalTime || 1)) * 100)
                  return `${secondsToMinutes(yLabel * 60, true)} (${percent}%)`;
                }
              }
            },
            maintainAspectRatio: false,
            legend: {
              display: !showAllClients && chartScope === DAILY_CHART_SCOPE,
              position: 'bottom',
              reverse: true,
              labels: {
                generateLabels(chart) {
                  return Chart.defaults.global.legend.labels.generateLabels.apply(
                    this,
                    [chart]
                  ).filter((item, i) => i <= 3);
                },
                fontColor: colors.mediumGrey,
                boxWidth: 12,
                padding: 30,
                fontFamily: 'proxima_novaregular'
              }
            },
            scales: {
              xAxes: [{
                barThickness: chartScope === DAILY_CHART_SCOPE ? 6 : null,
                gridLines: {
                  drawOnChartArea: false,
                  color: colors.lightGrey,
                  zeroLineColor: colors.lightGrey
                },
                ticks: {
                  maxRotation: 0,
                  fontColor: colors.mediumGrey,
                  fontFamily: 'proxima_novaregular',
                  callback: (value, index, values) => {
                    if (chartScope === DAILY_CHART_SCOPE) {
                      if (
                        index === 0 ||
                        value.toDate().getMonth() !==
                        values[index - 1].toDate().getMonth()
                      )
                        return [value.format('D'), value.format('MMM')];
                      return value.format('D');
                    } else if (chartScope === MONTHLY_CHART_SCOPE)
                      return value.start.format('MMM');
                    return `${value.start.format('MMM D')} - ${value.end.format('MMM D')}`;
                  }
                }
              }],
              yAxes: [{
                stacked: true,
                gridLines: {
                  drawBorder: false,
                  color: colors.lightGrey,
                  zeroLineColor: colors.lightGrey,
                  tickMarkLength: 30
                },
                ticks: {
                  maxTicksLimit: 3,
                  fontColor: colors.mediumGrey,
                  fontFamily: 'proxima_novaregular',
                  callback: () => ''
                }
              }]
            }
          }
        })
      }, () => {
        const { chart: newChart } = this.state;
        const ticks = [];
        let meta = null;

        if (data.datasets.length)
          meta = newChart.getDatasetMeta(0);
        if (meta && meta.data && meta.data.length) {
          const yScale = meta.data[0]._yScale;

          _.forEach(yScale.ticksAsNumbers, (tick, i) => {
            const roundedTick = Math.round(tick * 10) / 10;
            ticks.push({ label: `${roundedTick}min`, y: yScale.getPixelForTick(i) });
          });
        }
        this.setState({ ticks });
      });
    });
  }
  render() {
    const { style, chartHeight } = this.props;
    const { ticks } = this.state;

    return (
      <div style={{ position: 'relative', height: chartHeight, ...style }}>
        <canvas id="ClientActivityCard-chart" />
        {
          ticks && ticks.length ?
            ticks.map(renderTickMark) :
            <div className="EmptyLabelAggregateActivityChart">No data for the selected range</div>
        }
      </div>
    );
  }
}

AggregateActivityChart.propTypes = {
  chartScope: PropTypes.string.isRequired,
  chartRange: PropTypes.object.isRequired,
  chartData: PropTypes.shape({
    rawData: PropTypes.array,
    dailyData: PropTypes.object
  }),
  showAllClients: PropTypes.bool,
  style: PropTypes.object,
  chartHeight: PropTypes.number
}
AggregateActivityChart.defaultProps = {
  showAllClients: false,
  style: null,
  chartHeight: 250,
  chartData: { rawData: null, dailyData: null }
}

export default AggregateActivityChart;
