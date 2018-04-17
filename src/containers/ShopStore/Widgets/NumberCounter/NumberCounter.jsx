import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import IconButton from 'material-ui/IconButton';
import Icon from '../Icon'

import './NumberCounter.scss'

const iconButtonStyle = { height: '100%', width: '100%', padding: '0px', verticalAlign: 'top' }
const iconStyle = { width: '5px', height: '5px' }

export default class NumberCounter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.count
    }
    this.incrementCount = this.incrementCount.bind(this)
    this.decrementCount = this.decrementCount.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  updateValue(inputValue) {
    const { callBack } = this.props
    const { value } = this.state
    if (value !== inputValue) {
      this.setState({ value: inputValue })
      callBack(inputValue)
    }
  }

  incrementCount() {
    let { value } = this.state
    value = _.parseInt(value)
    value = (value > 0) ? value + 1 : 1
    this.updateValue(value)
  }

  decrementCount() {
    let { value } = this.state
    value = _.parseInt(value)
    if (value > 0)
      this.updateValue(value - 1)
  }

  handleInputChange(value) {
    if (!isNaN(_.parseInt(value)) || value === '') {
      const intValue = (value !== '') ? _.parseInt(value) : value
      this.updateValue(intValue)
    }
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <div className="inputContainerCounter">
          <input
            className="inputItemCounter"
            type="text" value={value}
            onChange={(e) => {
              this.handleInputChange(e.target.value)
            }}
          />
        </div>
        <span className="upbuttonCounter">
          <IconButton
            onClick={this.incrementCount}
            style={iconButtonStyle}
            iconStyle={iconStyle}
          >
            <Icon name="chevron-up" fill="#d8d8d8" />
          </IconButton>
        </span>
        <span className="downbuttonCounter">
          <IconButton
            onClick={this.decrementCount}
            style={iconButtonStyle}
            iconStyle={iconStyle}
          >
            <Icon name="chevron-down" fill="#d8d8d8" />
          </IconButton>
        </span>
      </div>
    )
  }
}

NumberCounter.defaultProps = {
  count: 0
}

NumberCounter.propTypes = {
  callBack: PropTypes.func.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
