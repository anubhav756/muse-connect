import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'
import { user } from '../../../__mocks__/fixtures.json'
import Account from '../../../src/containers/Account'
import AccountSetting from '../../../src/containers/Account/Widgets/Account'
import BillingTab from '../../../src/containers/Account/Widgets/Billing'
import PlansTab from '../../../src/containers/Account/Widgets/Plans'
import SubscriptionCardWrapper from '../../../src/containers/Account/Widgets/SubscriptionCardWrapper'
import Loader from '../../../src/components/Loader/ContentLoader'

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  user,
  windowDimension: {
    innerWidth: 1150
  },
  routing: {
    locationBeforeTransitions: { pathname: '/account/account' }
  },
  subscription: {
    plansAccount: {
      isFetching: true,
      isError: false,
      info: {},
      enrolledPlan: {}
    }
  },
  account: {
    isFetching: false,
    isError: false,
    info: {}
  }
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) Account', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<Account />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  describe('', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('should render Account setting tab', () => {
      wrapper.find(AccountSetting).should.have.length(1)
    })
    it('should render Account Billing tab', () => {
      wrapper.find(BillingTab).should.have.length(1)
    })
    it('should render Plans Billing tab', () => {
      wrapper.find(PlansTab).should.have.length(1)
    })
    it('should render Subscription Card Wrapper at Plans Billing tab', () => {
      wrapper.find(PlansTab).find(SubscriptionCardWrapper).should.have.length(1)
    })
    it('should display loader at Subscription Card Wrapper at PlansBilling tab', () => {
      wrapper.find(PlansTab).find(SubscriptionCardWrapper).find(Loader).should.have.length(1)
    })
  })
})
