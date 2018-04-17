import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { Paper } from 'material-ui'
import _ from 'lodash'

import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss'
import breakPoints from '!!sass-variable-loader!./../../../styles/variables/breakpoints.scss'

import AddClient from '../../../components/AddClient'
import Icon from '../../../components/Icon'
import Loader from '../../../components/Loader/ContentLoader'
import TutorialPopover from '../../../components/TutorialPopover'
import { TutorialCards } from '../../../redux/modules/tutorialCard'

import './ActiveClients.scss'

const noDetailsColor = colors.lightGrey

export class ActiveClients extends React.Component {

  render() {
    const { showDetails, windowDimension, allClients, tutorial } = this.props
    const { clients } = this.props.clientList
    const { isFetching } = clients
    let emptyItemIconStyle = {}
    let mobileView = false
    if (windowDimension &&
      breakPoints &&
      windowDimension.innerWidth <= parseInt(breakPoints.breakPointXs)) {
      emptyItemIconStyle = { width: '12px' }
      mobileView = true
    }

    const aggregateData = _.get(allClients || {}, 'info.aggregate_data', {})
    const totalActiveClients = _.get(clients || {}, 'info.active_clients.length', 0)

    const showTutorial = tutorial && tutorial.tutorialCards[TutorialCards.activeClient]

    return (
      <Paper rounded={false} style={{ backgroundColor: 'white', minHeight: mobileView ? '152px' : '192px' }}>
        {
          isFetching || allClients.isFetching
            ? <Loader zDepth={0} />
            : <div className="containterActiveClients">
              {
                showTutorial &&
                <div style={{ position: 'absolute', bottom: '0px', left: '50%' }}>
                  <TutorialPopover
                    keyName={showTutorial}
                    preferPlace="below"
                    title="This Week's Trends"
                    text="Here, you will find high-level statistics showing how your clients have performed over the last week. Try adding yourself to Muse Connect and watching as your session data populates on the dashboard!"
                  />
                </div>
              }
              <Row>
                <Col xs={12} style={{ color: colors.darkGrey }}>
                  <div className="titleActiveClients" >
                    Active clients
                </div>
                  {
                    !showDetails &&
                    <div className="emptyDetailsActiveClients" >
                      Add client
                      <div className="addButtonDashBoard">
                        <AddClient zDepth={1} iconStyle={{ width: '12px', height: '12px', marginTop: '5px' }} />
                      </div>
                    </div>
                  }
                </Col>
              </Row>
              <Row className="detailsActiveClients" between="xs">
                <Col xs={2}>
                  <div>
                    {
                      showDetails
                        ? <span className="CardTextDashBoardCards">
                          {
                            totalActiveClients
                          }
                        </span>
                        : <span>
                          <span>
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                          <span className="detailItemActiveClients">
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                        </span>
                    }
                  </div>
                  <div className="NormalTextLightDashboard">
                    Total active clients
                  </div>
                </Col>
                <Col xs={2}>
                  <div>
                    {
                      showDetails
                        ? <span className="CardTextDashBoardCards">
                          {
                            totalActiveClients
                            ? `${Math.round(((aggregateData.act_last_week / totalActiveClients) * 100)) || 0}%`
                            : '0%'
                          }
                        </span>
                        : <span>
                          <span>
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                          <span className="detailItemActiveClients">
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                        </span>
                    }
                  </div>
                  <div className="NormalTextLightDashboard">Did session in the last 7 days</div>
                </Col>
                <Col xs={2}>
                  <div>
                    {
                      showDetails
                        ? <span className="CardTextDashBoardCards">
                          {
                            totalActiveClients
                            ? `${Math.round(((aggregateData.act_last_month / totalActiveClients) * 100)) || 0}%`
                            : '0%'
                          }
                        </span>
                        : <span>
                          <span>
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                          <span className="detailItemActiveClients">
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                        </span>
                    }
                  </div>
                  <div className="NormalTextLightDashboard">Did session in the last 30 days</div>
                </Col>
                <Col xs={2}>
                  <div>
                    {
                      showDetails
                        ? <span className="CardTextDashBoardCards">
                          {
                            totalActiveClients
                            ? parseFloat(_.get(aggregateData, 'act_days_per_week', 0)).toFixed(2)
                            : '0.00'
                          }
                        </span>
                        : <span>
                          <span>
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                          <span className="detailItemActiveClients">
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
                            totalActiveClients
                            ? parseFloat(_.get(aggregateData, 'act_mins_per_day', 0)).toFixed(2)
                            : '0.00'
                          }
                        </span>
                        : <span>
                          <span>
                            <Icon style={emptyItemIconStyle} name="subtract-icon" fill={noDetailsColor} />
                          </span>
                          <span className="detailItemActiveClients">
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
}

function mapStateToProps({ clientList, windowDimension, allClients, tutorial }) {
  const { info, isFetching, isError } = allClients
  const _allClients = {
    info,
    isFetching,
    isError
  }
  return ({ clientList, windowDimension, allClients: _allClients, tutorial })
}

export default connect(mapStateToProps)(ActiveClients)

ActiveClients.propTypes = {
  clientList: PropTypes.object.isRequired,
  windowDimension: PropTypes.object.isRequired,
  showDetails: PropTypes.bool.isRequired,
  allClients: PropTypes.object.isRequired
}
