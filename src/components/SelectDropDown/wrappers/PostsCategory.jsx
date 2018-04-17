import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { setPostsCategory as _setPostsCategory } from '../../../redux/modules/learn';
import { ALL } from '../../../libs/helpers/learn';
import SelectDropDown from '../SelectDropDown';

function PostsCategory({
  value,
  setPostsCategory,
  categories,
  isFetching,
  ...otherProps
}) {
  return (
    <SelectDropDown
      value={value}
      callBack={setPostsCategory}
      disabled={isFetching}
      options={{
        [ALL]: 'all categories',
        ..._.mapValues(categories, o => o.name)
      }}
      firstOption={ALL}
      {...otherProps}
    />
  );
}
PostsCategory.propTypes = {
  value: PropTypes.string.isRequired,
  setPostsCategory: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default connect(
  ({
    learn: {
      posts: {
        category: value,
        isFetching
      },
    categories: {
        list: categories
      }
    }
  }) => ({ value, categories, isFetching }),
  { setPostsCategory: _setPostsCategory }
)(PostsCategory);
