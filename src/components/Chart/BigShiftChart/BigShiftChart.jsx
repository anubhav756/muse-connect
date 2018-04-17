import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Chart from 'chart.js';
import _ from 'lodash';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import UserAvatar from '../../UserAvatar';
import { redirectToProfile } from '../../../libs/helpers/redirect';

import './BigShiftChart.scss';

const marginLeft = 50;
const marginRight = 60;

class BigShiftChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chart: null,
      barPositions: []
    }

    this.renderClientLabel = this.renderClientLabel.bind(this);
  }
  componentDidMount() {
    const { chartData } = this.props;

    if (chartData && !_.isEmpty(chartData))
      this.initializeGraph();
  }
  componentWillUnmount() {
    const { chart } = this.state;
    if (chart && chart.destroy)
      chart.destroy();
  }
  initializeGraph() {
    const { chartData } = this.props;
    const { chart } = this.state;
    const canvas = document.getElementById('BigShiftCard-chart');
    const ctx = canvas.getContext('2d');
    const labels = [];
    const data = [];
    const { width: canvasWidth } = canvas;
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    const sortedChartData = _.orderBy(
      _.map(chartData, (value, key) => ({ key, value })),
      ({ value: { shift } }) => shift,
      'desc'
    )

    gradient.addColorStop(0.2, colors.lightCyan);
    gradient.addColorStop(0.48, colors.cyan);
    gradient.addColorStop(0.52, colors.cyan);
    gradient.addColorStop(0.8, colors.lightCyan);

    _.forEach(sortedChartData, ({ value: { shift }, key }) => {
      labels.push(key);
      data.push(shift);
    })

    if (chart && chart.destroy)
      chart.destroy();

    const chartScale = Math.abs(_.maxBy(data, o => Math.abs(o))) || 0;

    this.setState({
      chart: new Chart(
        ctx, {
          type: 'horizontalBar',
          data: {
            labels,
            datasets: [{
              backgroundColor: gradient,
              hoverBackgroundColor: gradient,
              data
            }]
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            tooltips: {
              enabled: false,
              callbacks: {
                title(tooltipData) {
                  const { firstName, lastName } = chartData[tooltipData[0].yLabel];
                  return `${firstName} ${lastName}`;
                }
              }
            },
            scales: {
              xAxes: [{
                gridLines: {
                  zeroLineColor: colors.lightestGrey,
                  color: 'transparent'
                },
                ticks: {
                  min: chartScale * -1,
                  max: chartScale,
                  beginAtZero: true,
                  callback: () => ''
                }
              }],
              yAxes: [{
                barThickness: 7,
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false
                }
              }]
            }
          }
        }
      )
    }, () => {
      const { chart: newChart } = this.state;
      const barPositions = [];
      newChart.getDatasetMeta(0).data.forEach((element) => {
        barPositions.push({
          id: element._model.label,
          top: element._model.y - 12
        });
      });
      this.setState({
        barPositions
      });
    });
  }
  renderClientLabel({ id, top }) {
    const { chartData } = this.props;
    const { shift, profile, firstName, lastName } = chartData[id];
    const avatar = <UserAvatar user={{ profile, firstName, lastName }} size={20} fontSize={9} />;

    if (shift > 0)
      return (
        <div
          key={id}
          style={{
            position: 'absolute',
            top,
            right: -marginRight
          }}
        >
          <div onClick={() => redirectToProfile(id)} style={{ cursor: 'pointer' }}>
            <div className="ClientLabelBigShift">+{Math.floor(shift / 60)}</div> {avatar}
          </div>
        </div>
      );
    return (
      <div
        key={id}
        style={{
          position: 'absolute',
          top,
          left: -marginLeft
        }}
      >
        <div onClick={() => redirectToProfile(id)} style={{ cursor: 'pointer' }}>
          {avatar} <div className="ClientLabelBigShift">{Math.ceil(shift / 60)}</div>
        </div>
      </div>
    );
  }
  render() {
    const { style, chartData } = this.props;
    const { barPositions } = this.state;
    const emptyChart = !chartData || _.isEmpty(chartData)

    return (
      <div style={{ marginLeft, marginRight, position: 'relative', ...style }}>
        {
          !emptyChart ?
            <canvas id="BigShiftCard-chart" height="270" /> :
            <div className="EmptyLabelBigShiftChart">No big shifts in the past week</div>
        }
        {!emptyChart && barPositions.map(this.renderClientLabel)}
      </div>
    )
  }
}

BigShiftChart.propTypes = {
  chartData: PropTypes.object,
  style: PropTypes.object
}
BigShiftChart.defaultProps = {
  chartData: null,
  style: null
}

export default BigShiftChart;
