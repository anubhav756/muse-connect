import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress'
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss'

export default function Loader(props) {
  const zDepth = props.zDepth
  const progressColor = props.progressColor
  return (
    <Paper style={{ textAlign: 'center', backgroundColor: 'white', padding: '30px 0px', ...props.style }} zDepth={zDepth} >
      <CircularProgress size={30} color={progressColor} />
    </Paper>
  )
}

Loader.defaultProps = {
  zDepth: 1,
  style: {},
  progressColor: styleVariables.teal
}

Loader.propTypes = {
  zDepth: PropTypes.number,
  style: PropTypes.object,
  progressColor: PropTypes.string
}

