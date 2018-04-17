// import all reducers from within modules directory
import { routerReducer as routing } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import user from './user'
import client from './client'
import windowDimension from './windowDimension'
import notification from './notice'
import certification from './certification'
import onBoarding from './onBoarding'
import basicInfo from './basicInfo'
import clientList from './clientList'
import shopStore from '../../containers/ShopStore/reduxModule/shopStore'
import shopStoreNotice from '../../containers/ShopStore/reduxModule/shopStoreNotice'
import dashboard from './dashboard'
import learn from './learn'
import tutorial from './tutorialCard'
import subscription from './subscription'
import account from './account'
import notes from './notes'
import nonMuserInvites from './nonMuserInvites'

// combine all the reducers and export
export default {
  user,
  routing,
  form: formReducer,
  windowDimension,
  notification,
  certification,
  onBoarding,
  basicInfo,
  clientList,
  client,
  shopStore,
  shopStoreNotice,
  learn,
  tutorial,
  subscription,
  account,
  notes,
  nonMuserInvites,
  ...dashboard
}
