import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row } from 'react-flexbox-grid'

import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss'

import { StatusFilter } from '../../components/SelectDropDown'
import AddClient from '../../components/AddClient';
import { MOBILE_VIEW, TABLET_VIEW } from '../../libs/helpers/windowDimension';
// import ClientListActions from '../../components/ActionsDropDown/ClientListActions'

import {
  setStatusFilter as _setStatusFilter,
  setSortByColumn as _setSortByColumn,
  applyBulkAction as _applyBulkAction
} from '../../redux/modules/clientList'
import { ALL, CLIENT_NAME } from '../../libs/helpers/clientList'

import './ClientListFilters.scss'

// style constants
const filterLabelStyle = { padding: '0 8px 0 0', fontSize: '14px' }
const dropDownLabelStyle = { color: styleVariables.teal, paddingRight: '15px', fontWeight: '600' }
const selectedMenuItemStyle = { color: styleVariables.teal }
const dropDownStyle = { width: '140px', fontSize: '14px' }
const iconStyle = { right: '-15px', fill: styleVariables.mediumGrey, viewBox: '0 0 18 18' }
// const listActionLabelStyle = {
//   color: styleVariables.darkGrey,
//   padding: '0px',
//   textTransform: 'none'
// }
// const listActionIconStyle = { verticalAlign: 'middle', width: '18px', height: '18px' }
const menuItemStyle = { color: styleVariables.darkGrey, fontSize: '14px' }

/*
 * @function handleStatusFilter calls the action to set filter by status as option is selected
 *  at Status Filter
 */
function handleStatusFilter(value) {
  this.props.setStatusFilter(value)
}
/*
 * @function handleClientsSortBy calls the action to set Sort by Column which is selected at
 *   Sort By Select
 */
function handleClientsSortBy(value) {
  this.props.setSortByColumn(value)
}
/*
 * @function handleBulkAction calls the action to apply selected action at the selected list items
 */
function handleBulkAction() {
  // to be uncommented as functionality gets done
  // this.props.applyBulkAction(value)
}

export class ClientListFilters extends Component {

  constructor(props) {
    super(props)
    this.handleStatusFilter = handleStatusFilter.bind(this)
    this.handleClientsSortBy = handleClientsSortBy.bind(this)
    this.handleBulkAction = handleBulkAction.bind(this)
  }

  componentWillMount() {
    const {
      sortByColumn,
      statusFilter,
      setSortByColumn,
      setStatusFilter
    } = this.props;

    if (statusFilter !== ALL)
      setStatusFilter(ALL);
    if (sortByColumn !== CLIENT_NAME)
      setSortByColumn(CLIENT_NAME);
  }

  render() {
    const { windowDimension } = this.props;
    // const { windowDimension: { innerWidth }, sortByColumn } = this.props
    // const LastActiveFilterWidth = innerWidth < 330 ? '200px' : '210px'
    return (
      <Row style={{ margin: 0, position: 'relative' }}>
        {/* <div className="bulkActionClientList" >
          <ClientListActions
            label={'Bulk Action'}
            callBack={this.handleBulkAction}
            labelStyle={listActionLabelStyle}
            iconStyle={listActionIconStyle}
            menuItemStyle={menuItemStyle}
          />
        </div> */}
        <Row middle="xs" style={{ margin: 0 }}>
          <span style={filterLabelStyle}>Show</span>
          <StatusFilter
            style={dropDownStyle}
            menuItemStyle={menuItemStyle}
            selectedMenuItemStyle={selectedMenuItemStyle}
            labelStyle={dropDownLabelStyle}
            iconStyle={iconStyle}
            callBack={this.handleStatusFilter}
            className="dropDownClientList"
          />
        </Row>
        {/* <Row middle="xs" className="selectActionClientList">
          <span style={filterLabelStyle} >Sort By </span>
          <ClientsSortBy
            style={{ ...dropDownStyle, width: LastActiveFilterWidth }}
            selectedMenuItemStyle={selectedMenuItemStyle}
            labelStyle={dropDownLabelStyle}
            menuItemStyle={menuItemStyle}
            iconStyle={iconStyle}
            callBack={this.handleClientsSortBy}
            SortByVal={sortByColumn}
            className="dropDownClientList"
          />
        </Row> */}
        <AddClient
          style={{
            position: 'absolute',
            top: MOBILE_VIEW(windowDimension) ?
              8 :
              -20,
            right: MOBILE_VIEW(windowDimension) ?
              16 :
              TABLET_VIEW(windowDimension) ?
                32 :
                48
          }}
          mini={MOBILE_VIEW(windowDimension)}
        />
      </Row>
    )
  }
}

export default connect(
  ({ clientList: { sortByColumn, statusFilter }, windowDimension }) => ({
    sortByColumn,
    statusFilter,
    windowDimension
  }), {
    setSortByColumn: _setSortByColumn,
    setStatusFilter: _setStatusFilter,
    applyBulkAction: _applyBulkAction,
  }
)(ClientListFilters)

ClientListFilters.propTypes = {
  sortByColumn: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  setSortByColumn: PropTypes.func.isRequired,
  windowDimension: PropTypes.object.isRequired
}
