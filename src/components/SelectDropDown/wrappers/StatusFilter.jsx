import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setStatusFilter as _setStatusFilter } from '../../../redux/modules/clientList';
import SelectDropDown from '../SelectDropDown';
import {
  ALL,
  ACCEPTED,
  INVITED,
  ARCHIVED,
  STOPPED
} from '../../../libs/helpers/clientList';

function StatusFilter({
  value,
  setStatusFilter,
  ...otherProps
}) {
  return (
    <SelectDropDown
      value={value}
      callback={setStatusFilter}
      options={{
        [ALL]: 'all clients',
        [ACCEPTED]: 'active clients',
        [INVITED]: 'pending invitations',
        [ARCHIVED]: 'archived clients',
        [STOPPED]: 'stopped sharing'
      }}
      {...otherProps}
    />
  );
}
StatusFilter.propTypes = {
  value: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired
}

export default connect(
  ({ clientList: { statusFilter: value } }) => ({ value }),
  { setStatusFilter: _setStatusFilter }
)(StatusFilter);
