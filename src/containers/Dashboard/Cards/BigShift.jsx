import React from 'react';
import {
  Paper
} from 'material-ui';

import { BigShiftChart } from '../../../components/Chart';
import CardHeadingWithDivider from '../../../components/CardHeadingWithDivider'
import './BigShift.scss'

export function BigShift() {
  return (
    <Paper rounded={false} style={{ backgroundColor: 'white', height: 431 }}>
      <div className="containerBigShiftDashboard">
        <CardHeadingWithDivider dividerStyle={{ marginLeft: '-10px', marginRight: '-10px' }} text="This week's big shifts" hideDivider style={{ marginBottom: 8 }} />
        <div className="NormalTextLightBigShiftDashboard">
          {'Minutes spent meditating over the last 7 days vs.\
          the previous. (Minutes this week - minutes last week)'}
        </div>
        <BigShiftChart />
      </div>
    </Paper>
  )
}

export default BigShift;
