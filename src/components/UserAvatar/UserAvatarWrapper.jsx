import React from 'react';
import PropTypes from 'prop-types'
import UserAvatar from './UserAvatar';

function UserAvatarWrapper({
  user,
  ...otherProps
}) {
  if (!user)
    return <UserAvatar {...otherProps} />

  const {
    firstName,
    first_name,
    lastName,
    last_name,
    email,
    profile,
    avatar
  } = user;

  return (
    <UserAvatar
      user={{
        firstName: first_name || firstName || email,
        lastName: last_name || lastName,
        profile: avatar || profile
      }}
      {...otherProps}
    />
  );
}
UserAvatarWrapper.propTypes = {
  user: PropTypes.object
}
UserAvatarWrapper.defaultProps = {
  user: null
}

export default UserAvatarWrapper;
