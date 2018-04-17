import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Avatar } from 'material-ui';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import './UserAvatar.scss'

const _colors = [
  colors.lightTeal,
  colors.lightYellow,
  colors.lightOrange,
  colors.lightPink,
  colors.lightPurple,
  colors.lightCyan,
  colors.lightGreen
];

const userToColorMap = {};

let index = 0;

function getRandomColor(userName) {
  const prevColor = userToColorMap[userName];
  if (prevColor)
    return prevColor;

  const randomColor = _colors[index];
  userToColorMap[userName] = randomColor;

  index += 1;
  if (index >= _colors.length)
    index = 0;
  return randomColor;
}

class UserAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomColor: props.user && !props.user.profile ?
        getRandomColor(`${props.user.firstName} ${props.user.lastName}`) :
        null
    }
  }
  render() {
    const {
      user,
      fontSize,
      fontFamily,
      ...otherProps
    } = this.props;
    if (!user)
      return <Avatar backgroundColor={colors.lightestGrey} {...otherProps} />

    const {
      firstName,
      lastName,
      profile
    } = user;

    if (profile)
      return <Avatar className="userAvatar" src={profile} {...otherProps} />
    return (
      <Avatar
        color="white"
        backgroundColor={this.state.randomColor}
        {...otherProps}
      >
        <div style={{ fontSize, fontFamily }}>
          {
            `${firstName ? firstName[0].toUpperCase() : ''}${lastName ? lastName[0].toUpperCase() : ''}`}
        </div>
      </Avatar>
    );
  }
}

UserAvatar.propTypes = {
  user: PropTypes.object,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string
}
UserAvatar.defaultProps = {
  user: null,
  fontSize: 14,
  fontFamily: 'proxima_novasemibold'
}

export default UserAvatar;
