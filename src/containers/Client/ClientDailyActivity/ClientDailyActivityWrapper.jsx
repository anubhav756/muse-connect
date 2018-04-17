import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Loader from '../../../components/Loader/ContentLoader'
import NoResultFound from '../../../components/NoResultFoundCard'
import ClientDailyActivityComponent from './ClientDailyActivity'
import { resetDailySessions } from '../../../redux/modules/client'

export class ClientDailyActivityWrapper extends React.Component {
  componentWillMount() {
    const { clientId } = this.props
    this.props.resetDailySessions(clientId)
  }

  render() {
    const {
      dailySessions: { isError, isFetching: isFetchingDaily, info: { sessions } },
      aggregateSessions,
      client
    } = this.props
    const { isFetching } = aggregateSessions
    const { isFetching: isFetchingClient } = client
    const sessionAvail = sessions && sessions.length
    if (isError && !sessionAvail) {
      return (
        <div style={{ marginTop: '30px' }}>
          <NoResultFound text="Something went wrong" />
        </div>
      )
    }
    return (
      <div>
        {
          isFetching || isFetchingClient || (isFetchingDaily && !sessionAvail)
          ? <Loader />
          : <ClientDailyActivityComponent {...this.props} />
        }
      </div>
    )
  }
}

function mapStateToProps({ client }) {
  return {
    client: client.client,
    aggregateSessions: client.aggregateSessions,
    dailySessions: client.dailySessions,
  }
}

ClientDailyActivityWrapper.propTypes = {
  aggregateSessions: PropTypes.object.isRequired,
  dailySessions: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  clientId: PropTypes.string.isRequired,
  resetDailySessions: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { resetDailySessions })(ClientDailyActivityWrapper)