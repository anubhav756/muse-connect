import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { CircularProgress } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles'
import ClientSidebar from '../../../src/containers/Client/ClientSidebar'
import Sidebar from '../../../src/components/Sidebar'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  client: {
    client: {
      isFetching: true,
      info: {},
    },
  },
  isError: false
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) clientSidebar', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<ClientSidebar />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  describe('fetching client', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('Sidebar should exist', () => {
      wrapper.find(Sidebar).should.have.length(1)
    })
    it('Should render loader', () => {
      wrapper.find(CircularProgress).should.have.length(1)
    })
  })
  describe('client has fetch', () => {
    let wrapper = null
    beforeAll(() => {
      storeState.client.client.isFetching = false
      contextRef = getContext(store)
      wrapper = buildWrapper()
    })
    it('Should not render loader', () => {
      wrapper.find(CircularProgress).should.have.length(0)
    })
    it('should call handleClick of Sidebar user action button', () => {
      wrapper.find(Sidebar).getElement().props.userActionButtons[0].handleClick()
    })
  })
})
