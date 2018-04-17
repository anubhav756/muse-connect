import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {
  Paper
} from 'material-ui';
import CardHeadingWithDivider from '../../../components/CardHeadingWithDivider';
import { AggregateActivityChart } from '../../../components/Chart';
import TutorialPopover from '../../../components/TutorialPopover';
import { TutorialCards } from '../../../redux/modules/tutorialCard';
import { MOBILE_VIEW } from '../../../libs/helpers/windowDimension'
import './ClientActivity.scss'

class ClientActivity extends React.Component {
  render() {
    const { tutorial, windowDimension } = this.props
    const preferPlace = MOBILE_VIEW(windowDimension) ? 'below' : 'right'
    const showTutorial = tutorial && tutorial.tutorialCards[TutorialCards.clientActivity]
    return (
      <Paper rounded={false} style={{ backgroundColor: 'white', height: 376 }}>
        <div className="clientActivityDashboard">
          {
            showTutorial &&
            <div className="tutorialPopoverClientActivity" >
              <TutorialPopover
                keyName={showTutorial}
                preferPlace={preferPlace}
                title="All Client Activity"
                text="This graph shows all of your clients' sessions. You can focus on particular time periods by adjusting the date range, providing you with more insights on your clients' sessions."
              />
            </div>
          }
          <CardHeadingWithDivider dividerClassName="dividerClientActivityDashboard" text="For all client activity" />
          <AggregateActivityChart
            showAllClients
            chartHeight={174}
            className="AggregateChartContainerDashboard"
          />
        </div>
      </Paper>
    )
  }
}

export default connect(({ tutorial, windowDimension }) =>
  ({ tutorial, windowDimension }))(ClientActivity)

ClientActivity.propTypes = {
  windowDimension: PropTypes.object.isRequired,
  tutorial: PropTypes.object.isRequired,
}
