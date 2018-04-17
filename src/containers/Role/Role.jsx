import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Role({ user: { info: { role } } }) {
  return (
    <div>
      You are {role === 'admin' ? 'an admin' : 'not an admin'}
    </div>
  )
}

Role.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(({ user }) => ({ user }))(Role);
