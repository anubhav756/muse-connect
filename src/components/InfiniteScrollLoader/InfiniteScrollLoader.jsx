import React from 'react';
import PropTypes from 'prop-types'
import {
  RefreshIndicator
} from 'material-ui';

function InfiniteScrollLoader({ loading, size, ...otherProps }) {
  return (
    <center {...otherProps}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {
          loading &&
          <RefreshIndicator status={loading ? 'loading' : 'ready'} top={0} left={0} style={{ background: 'white' }} />
        }
      </div>
    </center>
  );
}
InfiniteScrollLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  size: PropTypes.number
}
InfiniteScrollLoader.defaultProps = {
  size: 40
}

export default InfiniteScrollLoader;
