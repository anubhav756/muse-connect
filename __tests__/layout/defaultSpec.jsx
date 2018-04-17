import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'

import Layout from '../../src/layout/Default'
import { mockStore } from '../../__mocks__/mockContext'

const getContext = () => ({
  muiTheme: getMuiTheme(),
  store: mockStore({ windowDimension: {}, routing: { locationBeforeTransitions: { pathname: '' } } }),
  router: {
    location: {
      pathname: ''
    }
  }
})

describe('(Layout) Default', () => {
  let context = getContext({})

  beforeAll(() => {
    context = getContext({})
  })

  const buildWrapper = () => (
    mount(<Layout />,
      {
        context,
        childContextTypes: {
          muiTheme: PropTypes.object,
          store: PropTypes.object,
          router: PropTypes.object,
        }
      })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })
})
