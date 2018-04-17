import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import UnCheckedIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckedIcon from 'material-ui/svg-icons/toggle/check-box'
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss';

export default function (props) {
  return (
    <Checkbox
      uncheckedIcon={<UnCheckedIcon style={{ fill: styleVariables.lightGrey }} />}
      checkedIcon={<CheckedIcon style={{ fill: styleVariables.teal }} />}
      iconStyle={{ height: '20px', width: '20px' }}
      {...props}
    />
  )
}
