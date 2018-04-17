import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { ListItem } from 'material-ui/List'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import {
  Divider
} from 'material-ui';
import UserAvatar from '../../components/UserAvatar'

export default function ListItemDashboard(props) {
  const {
    heading,
    headingClassName,
    subHeading,
    action,
    user,
    divider,
    dividerStyle,
    headingStyle,
    listItemStyle,
    listItemBodyStyle,
    actionWrapperStyle,
    avatarSize,
    dividerClassName,
    ...otherProps
  } = props
  const showAvatar = !_.isEmpty(user)
  const True = true
  const listItem = (
    <ListItem
      style={{ ...listItemBodyStyle }}
      primaryText={<div className={headingClassName} style={{ color: colors.darkGrey, fontFamily: 'proxima_novasemibold', ...headingStyle }}>{heading}</div>}
      disabled={True}
      secondaryText={subHeading && <div style={{ color: colors.mediumGrey, fontFamily: 'proxima_novaregular', whiteSpace: 'initial', overflow: 'initial' }}>{subHeading}</div>}
    />
  )
  return (
    <div {...otherProps}>
      {
        showAvatar &&
        <div style={{ display: 'inline-block' }}>
          <UserAvatar user={user} size={avatarSize} />
        </div>
      }
      <div style={{ display: 'inline-block', verticalAlign: 'middle', ...listItemStyle }}>
        {listItem}
      </div>
      {
        <div className="clearfix" style={{ display: 'inline-block', float: 'right', ...actionWrapperStyle }}>
          {action}
        </div>
      }
      {
        divider &&
        <div className={dividerClassName} >
          <Divider
            style={{
              background: colors.lightestGrey,
              marginTop: 30,
              marginLeft: -30,
              marginRight: -30,
              ...dividerStyle
            }}
          />
        </div>
      }
    </div>
  )
}

ListItemDashboard.defaultProps = {
  action: [],
  subHeading: '',
  user: {},
  divider: false,
  dividerStyle: {},
  listItemStyle: {},
  headingStyle: {},
  actionWrapperStyle: {},
  avatarSize: 36,
  heading: '',
  dividerClassName: '',
  headingClassName: '',
  listItemBodyStyle: {}
}

ListItemDashboard.propTypes = {
  heading: PropTypes.string,
  headingClassName: PropTypes.string,
  subHeading: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  action: PropTypes.array,
  user: PropTypes.object,
  divider: PropTypes.bool,
  dividerStyle: PropTypes.object,
  listItemStyle: PropTypes.object,
  headingStyle: PropTypes.object,
  actionWrapperStyle: PropTypes.object,
  listItemBodyStyle: PropTypes.object,
  avatarSize: PropTypes.number,
  dividerClassName: PropTypes.string
}
