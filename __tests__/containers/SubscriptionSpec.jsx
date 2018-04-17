import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'
import SubscriptionComponent from '../../src/containers/Subscription'
import { user, plansAccount } from '../../__mocks__/fixtures.json'
import Loader from '../../src/components/Loader/ContentLoader'
import ErrorMessage from '../../src/components/ErrorMessage'
import SubscriptionCard from '../../src/components/SubscriptionCard'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  user,
  subscription: {
    plans: {
      isFetching: true,
      isError: false,
      selectedPlan: {},
      info: {}
    }
  }
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) Subscription Onboard', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<SubscriptionComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  describe('fetching data', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('should render loader', () => {
      wrapper.find(Loader).should.have.length(1)
    })
  })

  describe('Error happens while fetching data', () => {
    let wrapper = null
    beforeAll(() => {
      storeState.subscription.plans = { isError: true,
        isFetching: false,
        selectedPlan: {},
        info: {}
      }
      wrapper = buildWrapper()
    })
    it('should render ErrorMessage Component', () => {
      wrapper.find(ErrorMessage).should.have.length(1)
    })
  })
  describe('data has fetched', () => {
    let wrapper = null
    beforeAll(() => {
      storeState.subscription.plans = { info: plansAccount, isError: false }
      wrapper = buildWrapper()
    })
    it('should render two subscription card', () => {
      wrapper.find(SubscriptionCard).should.have.length(2)
    })
  })
})
