import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import { secondsToMinutes } from '../../libs/helpers/common';

class ClientSessionChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chart: null
    }
  }
  componentDidMount() {
    const {
      session: {
        id,
      compact_wind_scores
      }
    } = this.props;
    // parse to be removed as api response get fixed
    // removed leading zeros from numbers so that JSON.parse could not throw error
    const windscore = JSON.parse(
      `[${`${compact_wind_scores.replace(/\b0+/g, ' ')}`.split(',')
        .map(o => o.trim()).map(o => o || 0).join(', ')}]`
    );
    const ctx = document.getElementById(`ClientSessionCard-chart-${id}`).getContext('2d');

    this.saveChart(
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(windscore),
          datasets: [{
            data: windscore,
            fill: false,
            borderWidth: 1.4,
            lineTension: 0,
            borderColor: colors.cyan,
            pointRadius: 0
          }]
        },
        options: {
          tooltips: {
            enabled: false
          },
          hover: false,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              display: false,
              ticks: {
                min: 0,
								max: 100
              }
            }],
            xAxes: [{
              gridLines: {
                drawOnChartArea: false
              },
              ticks: {
                fontColor: colors.mediumGrey,
                fontSize: 12,
                autoSkip: false,
                maxRotation: 0,
                callback(value, index, values) {
                  const largestMultiple = values.length > 60 ?
                    Math.floor(values.length / 60) * 60 :
                    Math.floor(values.length / 4) * 4;
                  if ((
                    index % (largestMultiple / 4) === 0 &&
                    index < largestMultiple
                  ) ||
                    index === values.length - 1
                  )
                    return secondsToMinutes(index + 1);
                }
              }
            }]
          }
        }
      })
    );
  }
  componentWillUnmount() {
    const { chart } = this.state;
    if (chart && chart.destroy)
      chart.destroy();
  }
  saveChart(chart) {
    this.setState({ chart });
  }
  render() {
    const { style, session: { id } } = this.props;
    return (
      <div style={style}>
        <canvas id={`ClientSessionCard-chart-${id}`} />
      </div>
    )
  }
}

ClientSessionChart.propTypes = {
  session: PropTypes.object.isRequired,
  style: PropTypes.object
}
ClientSessionChart.defaultProps = {
  style: null
}

export default ClientSessionChart;
