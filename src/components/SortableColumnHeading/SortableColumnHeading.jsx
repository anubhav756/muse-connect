import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatButton
} from 'material-ui';
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import Icon from '../Icon';
import './SortableColumnHeading.scss';

function SortableColumnHeading({ columnLabel, onClick, isSortColumn, reverse, ...otherProps }) {
  return (
    <FlatButton
      disableTouchRipple
      hoverColor="transparent"
      onClick={onClick}
      {...otherProps}
    >
      <div className="textSortableColumnHeading">
        {columnLabel}
        <Icon
          name={isSortColumn && reverse ? 'arrow-dropdown-reverse' : 'arrow-dropdown'}
          color={
            isSortColumn && !otherProps.disabled ?
              styleVariables.teal :
              styleVariables.lightGrey
          }
          style={{ height: 24, width: 24, marginBottom: -7 }}
        />
      </div>
    </FlatButton>
  );
}
SortableColumnHeading.propTypes = {
  columnLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isSortColumn: PropTypes.bool,
  reverse: PropTypes.bool
}
SortableColumnHeading.defaultProps = {
  isSortColumn: false,
  reverse: false
}

export default SortableColumnHeading;
