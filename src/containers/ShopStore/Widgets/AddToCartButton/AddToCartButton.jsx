import React from 'react'
import PropTypes from 'prop-types'
import styleVariables from '!!sass-variable-loader!./../../variables.scss'

import RaisedButton from 'material-ui/RaisedButton'
import Icon from '../Icon'

export default function AddToCartButton(props) {
  return (
    <RaisedButton
      label={
        <div style={{ display: 'inline-block' }}>
          <span>
            <Icon name="cart-icon" fill={styleVariables.white} style={{ width: '12px', height: '12px' }} />
          </span>
          <span style={{ verticalAlign: 'top', marginLeft: '9px', letterSpacing: '0.9px', fontFamily: 'proxima_novasemibold' }}>
          Add to cart
          </span>
        </div>}
      backgroundColor={styleVariables.cyan}
      labelColor={styleVariables.cyan}
      style={{ height: '100%', width: '100%' }}
      labelStyle={{ color: styleVariables.white, fontSize: '12px', fontWeight: '600px', padding: '4px' }}
      onClick={props.onClick}
    />
  )
}

AddToCartButton.propTypes = {
  onClick: PropTypes.func.isRequired
}
