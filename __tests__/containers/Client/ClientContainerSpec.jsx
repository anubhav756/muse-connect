import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'
import { Tabs } from 'material-ui/Tabs'
import ClientSummaryComponent from 'containers/Client/ClientSummary'
import ClientNotes from 'containers/Client/ClientNotes'
import { initialState as notesInitialState } from 'redux/modules/notes'
import ErrorMessage from 'components/ErrorMessage'
import ClientComponent from 'containers/Client/Client'

jest.mock('components/Chart/AggregateActivityChart')
jest.mock('libs/cleverTap')


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

let clientState = {
  client: {
    isFetching: false,
    info: {},
  },
  aggregateSessions: {
    isFetching: false,
    info: {
      aggregateSessions: [],
      aggregateDays: {}
    }
  },
  dailySessions: {
    isFetching: false,
    info: {
      sessions: []
    },
    isError: false,
    currentClientId: null,
  },
  isError: false
}
const store = {
  getState: () => ({
    windowDimension: { innerWidth: '450px' },
    routing: {
      locationBeforeTransitions: { pathname: '/client/1619813571' },
    },
    client: clientState,
    notes: notesInitialState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) Client', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = (props = {}) => (
    mount(<ClientComponent {...props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        client: PropTypes.object,
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
    it('should render Tabs component', () => {
      wrapper.find(Tabs).should.have.length(1)
    })
    it('should render only ClientSummaryComponent', () => {
      wrapper.find(ClientSummaryComponent).should.have.length(1)
      wrapper.find(ClientNotes).should.have.length(0)
    })
    it('should render Client Notes view as tab is changed', () => {
      wrapper.find(Tabs).getElement().props.onChange('Notes')
      wrapper.update()
      wrapper.find(ClientNotes).should.have.length(1)
    })
    describe('', () => {
      beforeAll(() => {
        clientState.isError = true
        wrapper = buildWrapper()
      })
      it('should show Error message if there is error is redux state', () => {
        wrapper.find(ErrorMessage).should.have.length(1)
      })
    })
  })
})
