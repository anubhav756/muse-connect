import React from 'react'
import { Route, IndexRoute } from 'react-router'

// Authentication route wrappers
import UserIsLoggedOut from '../components/RouterWrappers/UserIsLoggedOut'
import UserIsAuthenticated from '../components/RouterWrappers/UserIsAuthenticated'
import UserIsFullyRegistered from '../components/RouterWrappers/UserIsFullyRegistered'
import UserIsRegistered from '../components/RouterWrappers/UserIsRegistered'
import UserIsAdmin from '../components/RouterWrappers/UserIsAdmin'

// Containers
import SignIn from '../containers/SignIn'
import SignUp from '../containers/SignUp'
import Subscription from '../containers/Subscription'
import ClientListView from '../containers/ClientList'
import Dashboard from '../containers/Dashboard'
import Account, { tabs } from '../containers/Account'
import Invoice from '../containers/Invoice'
import Client from '../containers/Client'
import Role from '../containers/Role'
import ShopStoreView from '../containers/ShopStore'
import Learn from '../containers/Learn'
import ArticleDetailsView from '../containers/Learn/ArticleDetails'
import BussinessProCertification from '../containers/BusinessProCertification'
import BasicInformation from '../containers/BasicInformation'
import FAQsView from '../containers/FAQs'

import { logoutUser } from '../redux/modules/user'

import endPoints from './endPoints'


// -------------------------------------------
// Helper Methods
// -------------------------------------------
function handleAccountEnter(route, replace) {
  const _tabs = tabs.map(tab => tab.value);
  const tab = route.location.pathname.split('/')[2];
  if (!tab || _tabs.indexOf(tab) === -1)
    replace(`${endPoints.account.index}/${_tabs[0]}`);
}
function handleClientEnter(route, replace) {
  if (!route.location.pathname.split('/')[2])
    replace(endPoints.clients);
}
function handleSignOut(store) {
  return (route) => {
    if (route.location.query.signout)
      store.dispatch(logoutUser);
  }
}

/*
 * @export {function} Routes
 * @param {object} store is the redux store which can be access on hook eg. 'onEnter hook'.
 * @returns the Routes which is to be accessed by the app
 */
export default function Routes(store) {
  return (
    <Route>
      <Route component={UserIsLoggedOut}>
        <Route path={endPoints.signin} component={SignIn} />
        <Route path={endPoints.signup} component={SignUp} />
      </Route>
      <Route component={UserIsAuthenticated} onEnter={handleSignOut(store)}>
        <Route path={endPoints.onboarding.index} component={UserIsRegistered}>
          <Route
            path={endPoints.onboarding.certification}
            component={BussinessProCertification}
          />
          <Route path={endPoints.onboarding.terms} component={BasicInformation} />
          <Route path={endPoints.onboarding.subscription} component={Subscription} />
        </Route>
        <Route component={UserIsFullyRegistered}>
          <Route path={endPoints.dashboard} component={Dashboard} />
          <Route path={endPoints.clients} component={ClientListView} />
          <Route path={endPoints.client.index} onEnter={handleClientEnter}>
            <Route path={endPoints.client.id} component={Client} />
          </Route>
          <Route path={endPoints.account.index} onEnter={handleAccountEnter}>
            <IndexRoute onEnter={handleAccountEnter} />
            <Route path={endPoints.account.tab} component={Account} />
          </Route>
          <Route path={`${endPoints.invoice}/:id`} component={Invoice} />
          <Route path={endPoints.shop} component={ShopStoreView} />
          <Route path={`${endPoints.shop}/:id`} component={ShopStoreView} />
          <Route path={endPoints.learn} component={Learn} />
          <Route path={`${endPoints.learn}/:slug`} component={ArticleDetailsView} />
          <Route path={endPoints.faqs} component={FAQsView} />
          <Route path={endPoints.help} />
          <Route path={endPoints.role} component={Role} />
          <Route path={endPoints.admin} component={UserIsAdmin} />
        </Route>
      </Route>
    </Route>
  )
}
