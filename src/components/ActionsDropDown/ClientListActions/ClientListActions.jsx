import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styleVariables from '!!sass-variable-loader!./../../../styles/variables/colors.scss'

import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Icon from '../../../components/Icon'

export default class ClientsListActions extends Component {

  constructor(props) {
    super(props)
    this.handleFilterByChange = this.handleFilterByChange.bind(this)
  }

  /*
   * @function handleFilterByChange gets called as value is selected at filter
   * @param {object} event
   * @param {string} value stores the selected value respect to menu item
   * @memberOf ClientsListActions
   */
  handleFilterByChange(event, value) {
    const { callBack } = this.props
    callBack(value)
  }

  render() {
    const { label, labelStyle, iconStyle, menuItemStyle } = this.props
    return (
      <div>
        <IconMenu
          iconButtonElement={<FlatButton labelStyle={labelStyle} label={<div><span>{label}</span><Icon name={'arrow-dropdown'} color={styleVariables.mediumGrey} style={iconStyle} /></div>} />}
          onChange={this.handleFilterByChange}
          menuItemStyle={menuItemStyle}
        >
          <MenuItem value="NONE" primaryText="None" />
          <MenuItem value="ARCHIVE" primaryText="Archive" />
          <MenuItem value="RESTORE" primaryText="Unarchive client" />
          <MenuItem value="RESEND" primaryText="Re-send invitation" />
          <MenuItem value="CANCEL" primaryText="Cancel invitation" />
        </IconMenu>
      </div>
    )
  }
}

ClientsListActions.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.object.isRequired,
  callBack: PropTypes.func.isRequired,
  iconStyle: PropTypes.object.isRequired,
  menuItemStyle: PropTypes.object.isRequired
}
