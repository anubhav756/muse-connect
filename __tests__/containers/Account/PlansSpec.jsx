import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import RaisedButton from 'material-ui/RaisedButton'
import { getMuiTheme } from 'material-ui/styles'
import SubscriptionComponent from '../../../src/containers/Account/Widgets/SubscriptionCardWrapper'
import { user, plansAccount } from '../../../__mocks__/fixtures.json'
import Loader from '../../../src/components/Loader/ContentLoader'
import ErrorMessage from '../../../src/components/ErrorMessage'
import SubscriptionCard from '../../../src/components/SubscriptionCard'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  user,
  subscription: {
    plansAccount: {
      isFetching: false,
      isError: false,
      enrolledPlan: {},
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

describe('(Container) Subscription Account Setting', () => {
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
      storeState.subscription.plansAccount = { isError: true,
        isFetching: false,
        enrolledPlan: {},
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
      storeState.subscription.plansAccount = { info: plansAccount, isError: false }
      wrapper = buildWrapper()
    })
    it('should render two subscription card', () => {
      wrapper.find(SubscriptionCard).should.have.length(2)
    })
    it('Should render Payment checkout button', () => {
      wrapper.find('[label="Proceed with Payment"]').should.have.length(1)
    })
    it('Checkout button should be disabled as it is clicked and modal should be open', () => {
      wrapper.find(RaisedButton).getElement().props.onClick()
      wrapper.find('Subscription').instance().state.modalOpen.should.be.true()
      wrapper.find('Subscription').instance().state.termsAccepted.should.be.false()
    })
    it('should call _handleSelected as Subscription card is clicked', () => {
      wrapper.find(SubscriptionCard).at(0).getElement().props.onSelected()
    })
  })
})
