import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { FlatButton } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles'
import { PendingClient } from '../../../src/containers/Dashboard/Cards'
import ListItem from '../../../src/components/ClientListItem'
import { initialState as nonMuserInvitesInitialState } from '../../../src/redux/modules/nonMuserInvites'
import { initialState as clientListInitialState } from '../../../src/redux/modules/clientList'
import getStore from '../../../__mocks__/mockStore'
import Loader from '../../../src/components/Loader/ContentLoader'
import { nonMuserInvites, clientList } from '../../../__mocks__/fixtures.json'

const mockStore = getStore()

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

describe('(Card) Dashboard', () => {
  let store = mockStore()
  let contextRef = getContext(store)
  let wrapper = null

  const buildWrapper = () => (
    mount(<PendingClient />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  beforeAll(() => {
    store = mockStore({
      nonMuserInvites: {
        ...nonMuserInvitesInitialState,
        isFetching: true
      },
      clientList: {
        ...clientListInitialState,
        clients: {
          ...clientListInitialState.clients,
          isFetching: true
        }
      }
    })
    contextRef = getContext(store)
    wrapper = buildWrapper()
  })
  it('should render loader as clients list is being fetched', () => {
    wrapper.find(Loader).should.have.length(1)
  })
  describe('', () => {
    beforeAll(() => {
      store = mockStore({
        nonMuserInvites: {
          ...nonMuserInvitesInitialState,
          isFetching: false,
          info: nonMuserInvites,
          clonedList: nonMuserInvites
        },
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
    it('should display invites list item as invites has fetched', () => {
      wrapper.find(Loader).should.have.length(0)
      wrapper.find(ListItem).should.have.length(3)
    })
    it('should have account status for a non muser account as Needs a Muse account', () => {
      wrapper.find('#inviteAcctStatusPendingClient').at(0).text().should.equal('Needs a Muse account')
    })
    it('should have account status for a muser account as Has a Muse account', () => {
      wrapper.find('#inviteAcctStatusPendingClient').at(2).text().should.equal('Has a Muse account')
    })
    it('should resent email on click of Re sent button', (done) => {
      wrapper.find(FlatButton).at(0).getElement().props.onClick()
      const unsubscribe = store.subscribe(() => {
        if (store.getState().notification.message === 'Invitation has been re-sent') {
          unsubscribe()
          done()
        }
      })
    })
  })
})
