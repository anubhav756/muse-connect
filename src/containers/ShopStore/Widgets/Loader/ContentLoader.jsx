import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress'

export default function Loader(props) {
  const zDepth = props.zDepth

  return (
    <Paper style={{ textAlign: 'center', backgroundColor: 'white', padding: '30px 0px' }} zDepth={zDepth} >
      <CircularProgress size={30} />
    </Paper>
  )
}

Loader.defaultProps = {
  zDepth: 1
}

Loader.propTypes = {
  zDepth: PropTypes.number
}
