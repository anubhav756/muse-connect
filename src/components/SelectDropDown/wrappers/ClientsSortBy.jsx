import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { setSortByColumn as _setSortByColumn } from '../../../redux/modules/clientList';
import SelectDropDown from '../SelectDropDown';
import {
  CLIENT_NAME,
  LAST_SESSION,
  RECENTLY_VIEWED,
  CLIENT_SINCE,
  // TIME_SPENT,
  THIS_WEEK
} from '../../../libs/helpers/clientList';

function ClientsSortBy({
  value,
  setSortByColumn,
  ...otherProps
}) {
  return (
    <SelectDropDown
      value={value}
      callback={setSortByColumn}
      options={{
        [CLIENT_NAME]: 'alphabetical by first name',
        [LAST_SESSION]: 'most recent activity',
        [RECENTLY_VIEWED]: 'recently viewed',
        [CLIENT_SINCE]: 'recently added',
        /* [TIME_SPENT]: 'longest streak', */
        [THIS_WEEK]: 'most frequent musers'
      }}
      {...otherProps}
    />
  );
}
ClientsSortBy.propTypes = {
  value: PropTypes.string.isRequired,
  setSortByColumn: PropTypes.func.isRequired
}

export default connect(
  ({ clientList: { sortByColumn: value } }) => ({ value }),
  { setSortByColumn: _setSortByColumn }
)(ClientsSortBy);
