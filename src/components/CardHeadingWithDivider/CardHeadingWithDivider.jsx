import React from 'react'
import PropTypes from 'prop-types'
import {
  Divider
} from 'material-ui';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';

import './CardHeadingWithDivider.scss';

function CardHeadingWithDivider({ text, hideDivider, style, dividerStyle, dividerClassName }) {
  return (
    <div style={style}>
      <div className="LargeTextCardHeadingWithDivider">{text}</div>
      {
        !hideDivider &&
        <div className={dividerClassName}>
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
  );
}

CardHeadingWithDivider.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  dividerStyle: PropTypes.object,
  hideDivider: PropTypes.bool,
  dividerClassName: PropTypes.string,
}

CardHeadingWithDivider.defaultProps = {
  dividerStyle: {},
  hideDivider: false,
  style: null,
  dividerClassName: ''
}

export default CardHeadingWithDivider;
