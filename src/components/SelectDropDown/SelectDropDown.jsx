import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SelectField from 'material-ui/SelectField';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';

/**
 * Default styles (can be overridden by props)
 */
const _labelStyle = { color: colors.teal, paddingRight: '15px', fontFamily: 'proxima_novasemibold', userSelect: 'none' };
const _selectedMenuItemStyle = { color: colors.teal, fontFamily: 'proxima_novasemibold' };
const _style = { width: '180px', fontSize: '13px' };
const _iconStyle = { right: '-15px', fill: colors.mediumGrey, viewBox: '0 0 18 18' };
const _menuItemStyle = { color: colors.darkGrey, fontSize: '14px', fontFamily: 'proxima_novasemibold' };

export default class SelectDropDown extends Component {
  constructor(props) {
    super(props)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }
  /*
   * @function handleFilterChange gets called as value is selected at Sort
   * @param {object} event
   * @param {string} value stores the selected value respect to menu item
   * @memberOf ClientsSortBy
   */
  handleFilterChange(event, index, _value) {
    const { callBack, value } = this.props
    // updates if the selected is different than the current selected
    if (value !== _value)
      callBack(_value)
  }

  render() {
    const {
      style,
      labelStyle,
      iconStyle,
      selectedMenuItemStyle,
      menuItemStyle,
      className,
      value,
      options,
      firstOption,
      disabled
    } = this.props
    const menuItems = [];
    if (firstOption)
      menuItems.push(
        <MenuItem
          key={firstOption}
          value={firstOption}
          primaryText={options[firstOption]}
        />
      );

    _.forEach(options, (_value, _key) => {
      if (_key !== firstOption)
        menuItems.push(<MenuItem key={_key} value={_key} primaryText={_value} />);
    });
    return (
      <SelectField
        autoWidth
        disabled={disabled}
        style={{ ..._style, ...style }}
        labelStyle={{ ..._labelStyle, ...labelStyle }}
        iconStyle={{ ..._iconStyle, ...iconStyle }}
        menuItemStyle={{ ..._menuItemStyle, ...menuItemStyle }}
        selectedMenuItemStyle={{ ..._selectedMenuItemStyle, ...selectedMenuItemStyle }}
        value={value}
        onChange={this.handleFilterChange}
        className={className}
      >
        {menuItems}
      </SelectField>
    )
  }
}

SelectDropDown.propTypes = {
  labelStyle: PropTypes.object,
  style: PropTypes.object,
  callBack: PropTypes.func.isRequired,
  selectedMenuItemStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  menuItemStyle: PropTypes.object,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  options: PropTypes.object.isRequired,
  firstOption: PropTypes.string,
  disabled: PropTypes.bool
}
SelectDropDown.defaultProps = {
  className: null,
  labelStyle: null,
  selectedMenuItemStyle: null,
  style: null,
  iconStyle: null,
  menuItemStyle: null,
  firstOption: null,
  disabled: false
}
