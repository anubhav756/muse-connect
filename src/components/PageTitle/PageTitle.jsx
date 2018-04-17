import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import {
  Divider,
  FlatButton
} from 'material-ui';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import Icon from '../Icon';
import './PageTitle.scss';

function PageTitle({ text, offset, rightIcon, upperCase, backLink, ...otherProps }) {
  return (
    <div {...otherProps}>
      <div className={'clearfix titleButtonProductDetails'}>
        <FlatButton
          disabled={!backLink}
          disableTouchRipple
          hoverColor="transparent"
          label={upperCase ? text.toUpperCase() : text}
          onClick={() => backLink && browserHistory.push(backLink)}
          icon={backLink && <Icon name="chevron-left" style={{ height: 14, width: 14 }} />}
          labelStyle={{
            fontFamily: 'proxima_novasemibold',
            fontSize: 14,
            color: colors.darkGrey,
            letterSpacing: 1,
            textTransform: 'none'
          }}
          style={{
            marginTop: 26,
            marginLeft: -16
          }}
        />
        {
          rightIcon &&
          <div className={'rightIconPageTitle'}>
            {rightIcon}
          </div>
        }
      </div>
      <Divider
        style={{
          backgroundColor: colors.lightestGrey,
          marginLeft: -offset,
          marginRight: -offset,
          marginBottom: 20,
        }}
      />
    </div>
  );
}
PageTitle.propTypes = {
  text: PropTypes.string.isRequired,
  offset: PropTypes.number,
  style: PropTypes.object,
  rightIcon: PropTypes.array,
  backLink: PropTypes.string,
  upperCase: PropTypes.bool
}
PageTitle.defaultProps = {
  offset: 0,
  style: null,
  rightIcon: [],
  backLink: null,
  upperCase: true
}

export default PageTitle;
