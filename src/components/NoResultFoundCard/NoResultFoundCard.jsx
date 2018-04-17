import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper';

export default function NoResultFoundCard(props) {
  const zDepth = props.zDepth
  const style = props.style
  return (
    <Paper rounded={false} style={{ backgroundColor: 'white', padding: '30px 0', color: '#4a4a4a', textAlign: 'center', ...style }} zDepth={zDepth}>
      { props.text }
    </Paper>
  )
}

NoResultFoundCard.defaultProps = {
  zDepth: 1,
  text: 'No Result Found',
  style: {}
}

NoResultFoundCard.propTypes = {
  zDepth: PropTypes.number,
  text: PropTypes.string,
  style: PropTypes.object
}
