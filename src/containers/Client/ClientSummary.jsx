import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types'

import ErrorMessage from '../../components/ErrorMessage';
import { DESKTOP_VIEW } from '../../libs/helpers/windowDimension';
import Loader from '../../components/Loader/ContentLoader'
import OverviewCard from './OverviewCard';
import ClientCalendar from './ClientCalendarCard'
import ClientActivityCard from './ClientActivityCard';
import ClientDailyActivity from './ClientDailyActivity';

export function ClientSummary(props) {
  const { clientId, isError, client, errorText, wd } = props
  return (
    <div>
      {
        isError && !!errorText
        ? <ErrorMessage message={errorText} />
        : client.isFetching
          ? <Loader />
          : <div>
            {
              !DESKTOP_VIEW(wd) &&
              <div className="clientNameWrapperClient">
                {`${client.info.first_name}'s profile`}
                <div className="clientEmailWrapperClient emailClientProfile"><a href={`mailto:${client.info.email}`}>{client.info.email}</a></div>
              </div>
            }
            <Row>
              <Col xs={12}>
                <OverviewCard />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="itemsWrapClient">
                  <div className="calendarWrapClient">
                    <ClientCalendar />
                  </div>
                  <div className="activityWrapClient">
                    <ClientActivityCard />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div style={{ paddingTop: '12px' }}>
                  <ClientDailyActivity clientId={clientId} />
                </div>
              </Col>
            </Row>
          </div>
        }
    </div>
  )
}

ClientSummary.defaultProps = {
  errorText: 'An unexpected error occurred.'
}

ClientSummary.propTypes = {
  wd: PropTypes.object.isRequired,
  clientId: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired,
  errorText: PropTypes.string
}

export default connect(
  ({ windowDimension: wd, client: { client, isError, errorText } }) => ({
    wd,
    isError,
    errorText,
    client
  })
)(ClientSummary)
