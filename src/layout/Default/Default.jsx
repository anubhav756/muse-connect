import React from 'react'
import PropTypes from 'prop-types'
import { Col, Grid } from 'react-flexbox-grid'

import Header from './Header'
import endPoints from '../../routes/endPoints'
import './Default.scss'

export default function Default(props, context) {
  const { router } = context
  const _endPoints = router.location && router.location.pathname && router.location.pathname.split('/')
  const showHeader = _endPoints[1] && (`/${_endPoints[1].toLowerCase()}` !== endPoints.signin && `/${_endPoints[1].toLowerCase()}` !== endPoints.signup)
  return (
    <div className="containerDefault">
      {
        showHeader &&
        <Header />
      }
      <Grid fluid style={showHeader ? { margin: '64px 0 0 0', padding: 0 } : { margin: 0, padding: 0 }}>
        <Col xs={12} >
          {props.children}
        </Col>
      </Grid>
    </div>
  )
}

Default.contextTypes = {
  router: PropTypes.object.isRequired
}
