import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  setPostsFilter as _setPostsFilter,
} from '../../../redux/modules/learn';
import {
  ALL,
  PAST_WEEK,
  PAST_MONTH
} from '../../../libs/helpers/learn';
import SelectDropDown from '../SelectDropDown';

function PostsFilter({
  value,
  setPostsFilter,
  isFetching,
  ...otherProps
}) {
  return (
    <SelectDropDown
      value={value}
      callBack={setPostsFilter}
      disabled={isFetching}
      options={{
        [ALL]: 'all',
        [PAST_WEEK]: 'in the past week',
        [PAST_MONTH]: 'in the past month'
      }}
      firstOption={ALL}
      {...otherProps}
    />
  );
}
PostsFilter.propTypes = {
  value: PropTypes.string.isRequired,
  setPostsFilter: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default connect(
  ({ learn: { posts: { filter: value, isFetching } } }) => ({ value, isFetching }),
  { setPostsFilter: _setPostsFilter }
)(PostsFilter);
