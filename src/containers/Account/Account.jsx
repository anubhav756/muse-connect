import React from 'react';

import AccountSidebarComp from './AccountSidebar';
import AccountContentComponent from './AccountContent'

import './Account.scss';

export default function Account() {
  return (
    <div className="accountWrapper">
      <AccountSidebarComp />
      <div className="ContentOutsideSidebarAccount">
        <AccountContentComponent />
      </div>
    </div >
  );
}
