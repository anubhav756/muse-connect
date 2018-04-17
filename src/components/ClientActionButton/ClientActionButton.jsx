import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import Icon from '../Icon';
import './ClientActionButton.scss';

export const ARCHIVE_CLIENT = 'ARCHIVE_CLIENT';
export const UNARCHIVE_CLIENT = 'UNARCHIVE_CLIENT';
export const RESEND_INVITATION = 'RESEND_INVITATION';
export const CANCEL_INVITATION = 'CANCEL_INVITATION';

const actionButtonsMap = {
  [ARCHIVE_CLIENT]: {
    iconName: 'archive-icon',
    label: 'Archive client'
  },
  [UNARCHIVE_CLIENT]: {
    iconName: 'icon-pending',
    label: 'Unarchive client'
  },
  [RESEND_INVITATION]: {
    iconName: 'send-icon',
    label: 'Re-send invitation'
  },
  [CANCEL_INVITATION]: {
    iconName: 'delete-icon',
    label: 'Cancel invitation'
  }
}

function ClientActionButton(props) {
  const { style, onPress, type, disabled, disabledLabel, hide } = props;
  return (
    <div style={style}>
      <FlatButton
        disabled={disabled}
        onClick={onPress}
        style={{ paddingLeft: 8, paddingRight: 8 }}
      >
        {
          !hide &&
          <Icon
            fill={colors.lightGrey}
            name={actionButtonsMap[type].iconName}
            style={{ width: 18, height: 18, marginTop: 8, marginRight: 10 }}
          />
        }
        {
          !hide &&
          <div className={disabled ? 'textSmallLightClientActionButton' : 'textSmallClientActionButton'}>
            {
              disabled ?
                disabledLabel :
                actionButtonsMap[type].label
            }
          </div>
        }
      </FlatButton>
    </div>
  );
}
ClientActionButton.propTypes = {
  style: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.oneOf([
    ARCHIVE_CLIENT,
    UNARCHIVE_CLIENT,
    CANCEL_INVITATION,
    RESEND_INVITATION
  ]).isRequired,
  disabled: PropTypes.bool,
  disabledLabel: PropTypes.string,
  hide: PropTypes.bool
}
ClientActionButton.defaultProps = {
  style: null,
  disabled: false,
  disabledLabel: 'Please wait...',
  hide: false
}

export default ClientActionButton;
