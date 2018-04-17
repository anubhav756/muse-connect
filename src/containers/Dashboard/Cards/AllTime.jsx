import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';

import {
  Paper,
} from 'material-ui';

import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import breakPoints from '!!sass-variable-loader!./../../../styles/variables/breakpoints.scss'
import AddClient from '../../../components/AddClient'
import Icon from '../../../components/Icon';
import Loader from '../../../components/Loader/ContentLoader'
import { normaliseSeconds } from '../../../libs/helpers/common'

import './AllTime.scss'

const noDetailsColor = colors.lightGrey

export function AllTime(props) {
  const { showDetails, windowDimension, allClients } = props
  const { clients } = props.clientList
  const { isFetching, info: clientListInfo } = clients
  let emptyItemIconStyle = {}
  let mobileView = false
  if (windowDimension &&
    breakPoints &&
    windowDimension.innerWidth <= parseInt(breakPoints.breakPointXs)) {
    emptyItemIconStyle = { width: '12px' }
    mobileView = true
  }

  // Calculate total meditation time in hh:mm
  let totalMeditationTime;
  let totalMeditationTimeSeconds = 0;

  if (!allClients.isFetching && allClients.info.client_activity) {
    allClients.info.client_activity.map((data) => {
      totalMeditationTimeSeconds += data.total_time;
    });
    totalMeditationTime = normaliseSeconds(totalMeditationTimeSeconds);
  }

  return (
    <Paper rounded={false} style={{ backgroundColor: 'white', minHeight: mobileView ? '152px' : '192px' }}>
      {
        isFetching || allClients.isFetching
        ? <Loader zDepth={0} />
        : <div className="containterAllTime">
          <Row>
            <Col xs={12} style={{ color: colors.darkGrey }}>
              <div className="titleAllTime">
                All clients
              </div>
            </Col>
          </Row>
          <Row className="detailsAllTime" between="xs">
            <Col xs={2}>
              <div>
                {
                  showDetails
                  ? <span className="CardTextDashBoardCards">
                    {clientListInfo && clientListInfo.clients_count}
                  </span>
                : <span>
                  <span>
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                  <span className="detailItemAllTime">
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                </span>
                }
              </div>
              <div className="NormalTextLightDashboard">Total clients</div>
            </Col>
            <Col xs={2}>
              <div>
                {
                  showDetails ?
                    <span className="CardTextDashBoardCards">
                      {totalMeditationTime.hour}:{_.padStart(totalMeditationTime.min, 2, '0')}
                    </span>
                  : <span>
                      <span>
                        <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                      </span>
                      <span className="detailItemAllTime">
                        <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                      </span>
                    </span>
                }
              </div>
              <div className="NormalTextLightDashboard">Total meditation time in hours</div>
            </Col>
            <Col xs={2}>
              <div>
                {
                  showDetails
                  ? <span className="CardTextDashBoardCards">
                    {allClients.info && 
                    allClients.info.client_activity &&
                    allClients.info.client_activity.length || 0}
                  </span>
                : <span>
                  <span>
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                  <span className="detailItemAllTime">
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                </span>
                }
              </div>
              <div className="NormalTextLightDashboard">Total active days</div>
            </Col>
            <Col xs={2}>
              <div>
                {
                  showDetails
                  ? <span className="CardTextDashBoardCards">
                    {(allClients &&
                      allClients.info &&
                      allClients.info.aggregate_data &&
                      allClients.info.aggregate_data.all_days_per_week &&
                      parseFloat(allClients.info.aggregate_data.all_days_per_week).toFixed(2)) || 0}
                  </span>
                : <span>
                  <span>
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                  <span className="detailItemAllTime">
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                </span>
                }
              </div>
              <div className="NormalTextLightDashboard">Avg. active days per week</div>
            </Col>
            <Col xs={2}>
              <div>
                {
                  showDetails
                  ? <span className="CardTextDashBoardCards">
                    {
                      (allClients &&
                      allClients.info &&
                      allClients.info.aggregate_data &&
                      allClients.info.aggregate_data.all_mins_per_day &&
                      parseFloat(allClients.info.aggregate_data.all_mins_per_day).toFixed(2)) || 0
                    }
                  </span>
                : <span>
                  <span>
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                  <span className="detailItemAllTime">
                    <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                  </span>
                </span>
                }
              </div>
              <div className="NormalTextLightDashboard">Avg. minutes per active day</div>
            </Col>
          </Row>
        </div>
      }
    </Paper>
  )
}

function mapStateToProps({ clientList, windowDimension, allClients }) {
  const { info, isFetching, isError } = allClients
  const _allClients = {
    info,
    isFetching,
    isError
  }
  return ({ clientList, windowDimension, allClients: _allClients })
}

export default connect(mapStateToProps)(AllTime)

AllTime.propTypes = {
  clientList: PropTypes.object.isRequired,
  showDetails: PropTypes.bool.isRequired,
  windowDimension: PropTypes.object.isRequired,
  allClients: PropTypes.object.isRequired
}
