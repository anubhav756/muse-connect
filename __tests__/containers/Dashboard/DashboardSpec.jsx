import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'

import getStore from '../../../__mocks__/mockStore'
import { initialState as allClientsInitialState } from '../../../src/redux/modules/dashboard/allClients'
import { initialState as userInitialState } from '../../../src/redux/modules/user'
import { initialState as clientListInitialState } from '../../../src/redux/modules/clientList'
import { initialState as shopStoreInitialState } from '../../../src/containers/ShopStore/reduxModule/shopStore'
import { initialState as learnInitialState } from '../../../src/redux/modules/learn'
import { initialState as tutorialCardsInitialState, TutorialCards } from '../../../src/redux/modules/tutorialCard'
import DashboardComponent from '../../../src/containers/Dashboard/Dashboard'
import { Learn, HeadBand, BigShift, RecentActivity, PendingClient, RecentlyAccepted, ActiveClients, ClientActivity } from '../../../src/containers/Dashboard/Cards'
import { clientList, productStore, user, learn } from '../../../__mocks__/fixtures.json'
import Loader from '../../../src/components/Loader/ContentLoader'
import ProductCard from '../../../src/containers/ShopStore/Widgets/ProductCard'
import NoResultFound from '../../../src/components/NoResultFoundCard'
import LearnImage from '../../../src/components/LearnImage'

jest.mock('../../../src/components/Chart/AggregateActivityChart');
jest.mock('../../../src/components/Chart/BigShiftChart');

const mockStore = getStore()

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

function getMockedStore(_initialState = {}) {
  const initialState = _initialState
  initialState.user = { ...userInitialState, info: user.info }
  return mockStore(initialState)
}

describe('(Container) Dashboard', () => {
  let store = getMockedStore()
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<DashboardComponent />, {
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
      store = getMockedStore({ allClients: { ...allClientsInitialState, isError: true } })
      contextRef = getContext(store)
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('No result found card should render', () => {
      wrapper.find(NoResultFound).should.have.length(1)
    })
  })
  describe('', () => {
    let wrapper = null
    beforeAll(() => {
      store = mockStore({ allClients: { ...allClientsInitialState, isError: false } })
      contextRef = getContext(store)
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('Active clients card should exist', () => {
      wrapper.find(ActiveClients).should.have.length(1)
    })
    it('Pending clients card should exist', () => {
      wrapper.find(PendingClient).should.have.length(1)
    })
    it('Client Activity card should exist', () => {
      wrapper.find(ClientActivity).should.have.length(1)
    })
    it('Recently Accepted card should not exist', () => {
      wrapper.find(RecentlyAccepted).should.have.length(0)
    })
    it('Recently Activity card should not exist', () => {
      wrapper.find(RecentActivity).should.have.length(0)
    })
    it('Big shift card should exist', () => {
      wrapper.find(BigShift).should.have.length(1)
    })
    it('Learn card should exist', () => {
      wrapper.find(Learn).should.have.length(1)
    })
    it('Headband card should exist', () => {
      wrapper.find(HeadBand).should.have.length(1)
    })
    describe('after loading client list', () => {
      beforeAll(() => {
        store = getMockedStore({
          clientList: {
            ...clientListInitialState,
            clients: {
              ...clientListInitialState.clients, info: clientList
            }
          }
        })
        contextRef = getContext(store)
        wrapper = buildWrapper()
      })
      it('Recently Activity card should exist', () => {
        wrapper.find(RecentActivity).should.have.length(1)
      })
      it('Recently Accepted card should exist', () => {
        wrapper.find(RecentlyAccepted).should.have.length(1)
      })
    })
    describe('fetching Headband details', () => {
      beforeAll(() => {
        store = getMockedStore({ shopStore: { ...shopStoreInitialState, isFetching: true } })
        contextRef = getContext(store)
        wrapper = buildWrapper()
      })
      it('Should show loader', () => {
        wrapper.find(HeadBand).find(Loader).should.have.length(1)
      })
      it('Product card should not exist', () => {
        wrapper.find(HeadBand).find(ProductCard).should.have.length(0)
      })
    })
    describe('Headband component after fetching details', () => {
      beforeAll(() => {
        store = getMockedStore({
          shopStore:
          { ...shopStoreInitialState,
            isFetching: false,
            details: productStore
          }
        })
        contextRef = getContext(store)
        wrapper = buildWrapper()
      })
      it('Should not show loader', () => {
        wrapper.find(HeadBand).find(Loader).should.have.length(0)
      })
      it('Product card should exist', () => {
        wrapper.find(HeadBand).find(ProductCard).should.have.length(1)
      })
    })
    describe('Learn Card', () => {
      beforeAll(() => {
        store = getMockedStore({ learn: { ...learnInitialState, isError: true } })
        contextRef = getContext(store)
        wrapper = buildWrapper()
      })
      it('Learn card should exist', () => {
        wrapper.find(Learn).should.have.length(1)
      })
      it('No Result Found card should be rendered', () => {
        wrapper.find(Learn).find(NoResultFound).should.have.length(1)
      })
      describe('Learn Card categories loaded successfully, latest post details is still fetching', () => {
        beforeAll(() => {
          store = getMockedStore({ learn: { ...learnInitialState, isError: false } })
          contextRef = getContext(store)
          wrapper = buildWrapper()
        })
        it('No Result Found card should be rendered', () => {
          wrapper.find(Learn).find(Loader).should.have.length(1)
        })
      })
      describe('Learn Card categories loaded successfully, latest post details loaded successfully', () => {
        beforeAll(() => {
          store = getMockedStore({
            learn: {
              ...learnInitialState,
              categories: {
                ...learnInitialState.categories,
                isFetching: false,
                list: learn.categories
              },
              latestPost: { 
                ...learnInitialState.latestPost, info: learn.latestPost, isFetching: false
              },
              posts: {
                ...learnInitialState.posts, info: [learn.latestPost], isFetching: false
              }
            }
          })
          contextRef = getContext(store)
          wrapper = buildWrapper()
        })
        it('Should render LearnImage component', () => {
          wrapper.find(Learn).find(LearnImage).should.have.length(1)
        })
        it('Should call handleTouchTap onClick of LearnImage', () => {
          wrapper.find(Learn).find(LearnImage).getElement().props.onClick()
        })
      })
    })
    describe('RecentActivity component', () => {
      beforeAll(() => {
        store = getMockedStore({
          clientList: {
            ...clientListInitialState,
            clients: {
              ...clientListInitialState.clients, isFetching: true
            }
          }
        })
        contextRef = getContext(store)
        wrapper = buildWrapper()
      })
      it('RecentActivity should not rendered as currently there are no clients', () => {
        wrapper.find(RecentActivity).find(Loader).should.have.length(0)
      })
    })
    describe('', () => {
      beforeAll(() => {
        store = getMockedStore({
          tutorial: {
            ...tutorialCardsInitialState, tutorialCards: { ...TutorialCards }
          } 
        })
        contextRef = getContext(store)
        wrapper = buildWrapper()
      })
      it('Should reset tutorial cards if set any', () => {
        wrapper.unmount()
      })
    })
  })
})
