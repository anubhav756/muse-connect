import React from 'react';
import PropTypes from 'prop-types';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import Icon from '../Icon'

export default function Error(props) {
  return (
    <div className="errorText" style={{ ...props.style, position: 'relative' }}>
      <div style={{ ...props.textStyle, marginRight: 18, position: 'absolute' }}>{props.errorText}</div>
      <Icon style={{ height: '12px', width: '14px', position: 'absolute', overflow: 'hidden', top: 2, right: 0 }} fill={colors.red} name="error-icon" />
    </div>
  )
}
Error.propTypes = {
  style: PropTypes.object,
  textStyle: PropTypes.object,
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
}
Error.defaultProps = {
  style: {},
  textStyle: {}
}
