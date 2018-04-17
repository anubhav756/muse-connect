import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import Notice from '../../src/components/Notice'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  notification: {
    open: false,
    message: '',
    waitingMessages: []
  }
}

const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) Notice', () => {
  let contextRef = getContext(store)
  let wrapper = null
  const buildWrapper = () => (
    mount(<Notice />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  beforeAll(() => {
    contextRef = getContext(store)
    wrapper = buildWrapper()
  })
  it('should exist', () => {
    wrapper.should.have.length(1)
  })
})
