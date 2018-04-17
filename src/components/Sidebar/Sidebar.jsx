import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FlatButton,
  CircularProgress
} from 'material-ui';
import { browserHistory } from 'react-router';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import Icon from '../../components/Icon';
import UserAvatar from '../../components/UserAvatar';
import './Sidebar.scss'

function Sidebar({ title, backLink, user, userDetails, userActionButtons, loading, children }) {
  return (
    <div className="ContentInsideSidebar">
      <div style={{ position: 'relative', paddingBottom: '50px' }}>
        <FlatButton
          disabled={!backLink}
          disableTouchRipple
          hoverColor="transparent"
          label={title || ' '}
          onClick={() => backLink && browserHistory.push(backLink)}
          icon={backLink && <Icon name="chevron-left" style={{ height: 14, width: 14 }} />}
          labelStyle={{
            fontFamily: 'proxima_novasemibold',
            fontSize: 14,
            color: colors.darkGrey,
            letterSpacing: 1
          }}
          style={{
            marginTop: 26,
            marginLeft: -16
          }}
        />
        {
          title &&
          <Divider
            style={{
              backgroundColor: colors.lightestGrey,
              marginRight: 18,
              marginBottom: 10
            }}
          />
        }
        {
          loading ?
            <center>
              <CircularProgress style={{ marginTop: 80 }} />
            </center> :
            user &&
            <center style={{ marginTop: 38.5, marginLeft: -38 }}>
              <UserAvatar
                user={user}
                size={75}
                fontSize={30}
              />
              <div className="UserNameSidebar">{`${user.firstName} ${user.lastName}`}</div>
              {
                userDetails && userDetails.map((item) => {
                  if (item.label)
                    return <div key={item.key} className="DetailsSidebar">{item.label}</div>
                  return <br key={item.key} />
                })
              }
              {
                userActionButtons && userActionButtons.map(userActionButton => (
                  <FlatButton
                    key={userActionButton.key}
                    disableTouchRipple
                    hoverColor="transparent"
                    onClick={userActionButton.handleClick}
                  >
                    <div className="DetailsSidebar">
                      {userActionButton.icon}
                      {userActionButton.label}
                    </div>
                  </FlatButton>

                ))
              }
            </center>
        }
        {!loading && children}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  title: PropTypes.string,
  backLink: PropTypes.string,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profile: PropTypes.string
  }),
  userDetails: PropTypes.array,
  userActionButtons: PropTypes.array,
  loading: PropTypes.bool
}
Sidebar.defaultProps = {
  title: ' ',
  backLink: null,
  user: null,
  userDetails: null,
  userActionButtons: null,
  loading: false
}

export default Sidebar;
