import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styleVariables from '!!sass-variable-loader!./../../variables.scss'

import IconButton from 'material-ui/IconButton'
import Icon from '../Icon'

export default class ColorSwitcher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSlide: props.activeSlide // stores the active icon index
    }
    this.handleTouchTap = this.handleTouchTap.bind(this)
  }

  /*
   * @function handleTouchTap, callback function, which gets called when touch tap
   *   happens any of color switch icon
   * @param {number} index
   * @memberOf ColorSwitcher
   */
  handleTouchTap(index) {
    const { onColorSwitch } = this.props
    const { activeSlide } = this.state
    const slideIndex = _.parseInt(index)
    if (activeSlide !== slideIndex) {
      this.setState({ activeSlide: slideIndex })
      onColorSwitch(slideIndex)
    }
  }

  render() {
    const { imageOptions, containerStyle, iconStyle } = this.props
    const { activeSlide } = this.state
    return (
      <div style={containerStyle}>
        {
          !_.isEmpty(imageOptions) &&
            imageOptions.length &&
            (imageOptions[0].name === 'Colour' || imageOptions[0].name === 'Color') &&
            !_.isEmpty(imageOptions[0].values) &&
            imageOptions[0].values.map((value, index) => (
              <IconButton
                key={imageOptions[0].values[index]}
                style={{ height: '100%', width: '100%', padding: '0px', verticalAlign: 'top' }}
                iconStyle={iconStyle}
                onClick={() => this.handleTouchTap(index)}
              >
                <Icon name="dot" fill={imageOptions[0].values[index]} stroke={(index === activeSlide) ? styleVariables.teal : styleVariables.lightGrey} />
              </IconButton>
            ))
        }
      </div>
    )
  }
}

ColorSwitcher.defaultProps = {
  activeSlide: 0
}

ColorSwitcher.propTypes = {
  imageOptions: PropTypes.array.isRequired,
  containerStyle: PropTypes.object.isRequired,
  iconStyle: PropTypes.object.isRequired,
  onColorSwitch: PropTypes.func.isRequired,
  activeSlide: PropTypes.number
}
