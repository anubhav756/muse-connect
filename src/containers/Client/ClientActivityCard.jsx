import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AggregateActivityChart } from '../../components/Chart';

import './ClientActivityCard.scss'

function ClientActivityCard({ first_name }) {
  return (
    <div className="containerClientActivity" >
      <div className="aggChartClientActivity" >
        <div className="CardHeadingClient">{`${first_name}'s activity`}</div>
        <AggregateActivityChart className="ChartContainerClientActivity" />
      </div>
    </div>
  )
}
ClientActivityCard.propTypes = {
  first_name: PropTypes.string
}
ClientActivityCard.defaultProps = {
  first_name: 'Client'
}

export default connect(
  ({ client: { client: { info: { first_name } } } }) => ({ first_name })
)(ClientActivityCard);
