import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import DashboardSidebar from './DashboardSideBar'
import DashboardContent from './DashboardContent'
import { resetTutorialCard } from '../../redux/modules/tutorialCard'
import './Dashboard.scss'

export class Dashboard extends React.Component {
  componentWillUnmount() {
    const { tutorial } = this.props
    if (!_.isEmpty(tutorial.tutorialCards)) {
      this.props.resetTutorialCard() // reset tutorial when component is about to unmount
    }
  }

  render() {
    const { tutorial } = this.props
    return (
      <div className="containerDashBoard">
        {
          !_.isEmpty(tutorial.tutorialCards) &&
          <div className="overlayTutorialPopover">
            <div className="hideTutorial">
              <div className="hideTutorialButton" onClick={() => this.props.resetTutorialCard()}>
                Skip Tutorial
              </div>
            </div>
          </div>
        }
        <div>
          <DashboardSidebar />
        </div>
        <div className="ContentContainerDashboard">
          <DashboardContent />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ tutorial }) {
  return { tutorial }
}
export default connect(mapStateToProps, { resetTutorialCard })(Dashboard)

Dashboard.propTypes = {
  tutorial: PropTypes.object.isRequired,
  resetTutorialCard: PropTypes.func.isRequired
}
