import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import {
  Tabs,
  Tab
} from 'material-ui';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import breakPoints from '!!sass-variable-loader!./../../styles/variables/breakpoints.scss';
import endPoints from '../../routes/endPoints';
import Plans from './Widgets/Plans'
import Account from './Widgets/Account';
import Billing from './Widgets/Billing';

import './AccountContent.scss'

export const tabs = [{
  title: 'Account',
  value: 'account',
  content: () => <Account />
}, {
  title: 'Billing',
  value: 'billing',
  content: () => <Billing />
}, {
  title: 'Plans',
  value: 'plans',
  content: () => <Plans />
}]

function renderEnhancedTab(tab) {
  const { title, value, content } = tab;
  const selected = this.props.currentTab === value;
  return (
    <Tab
      key={value}
      value={value}
      label={title}
      style={{
        color: selected ? colors.teal : colors.mediumGrey,
        fontSize: 15,
        fontFamily: 'proxima_novasemibold',
        letterSpacing: 1
      }}
    >
      {content.bind(this)()}
    </Tab>
  );
}

export class AccountContent extends Component {
  constructor(props) {
    super(props);
    this.renderEnhancedTab = renderEnhancedTab.bind(this);
  }
  handleChange = value => browserHistory.push(`${endPoints.account.index}/${value}`)
  render() {
    const {
      currentTab,
      innerWidth
    } = this.props;

    return (
      <Tabs
        value={currentTab}
        onChange={this.handleChange}
        tabItemContainerStyle={{
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${colors.lightestGrey}`,
          paddingTop: 12
        }}
        contentContainerStyle={
          innerWidth > parseInt(breakPoints.breakPointSm, 10) ?
            { paddingLeft: 30, paddingRight: 30 } :
            null
        }
        inkBarStyle={{ backgroundColor: colors.teal }}
      >
        {tabs.map(this.renderEnhancedTab)}
      </Tabs >
    )
  }
}
AccountContent.propTypes = {
  currentTab: PropTypes.string.isRequired,
  innerWidth: PropTypes.number.isRequired
}

export default connect(
  ({ routing, windowDimension: { innerWidth } }) => ({
    currentTab: routing.locationBeforeTransitions.pathname.split('/')[2],
    innerWidth
  })
)(AccountContent);
