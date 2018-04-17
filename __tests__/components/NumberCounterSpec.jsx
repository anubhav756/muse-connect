import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import NumberCounter from '../../src/containers/ShopStore/Widgets/NumberCounter'


const props = {
  callBack: () => {},
  count: 0
}

const getContext = store => ({
  store,
  muiTheme: getMuiTheme()
})

const store = {
  getState: () => ({
    shopStore: {
      isFetching: false,
      isError: false,
      details: {},
      storeCountryCode: null
    }
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) NumberCounter', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = propValues => (
    mount(<NumberCounter {...propValues} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper(props)
    wrapper.should.have.length(1)
  })

  describe('should', () => {
    const wrapper = buildWrapper(props)
    it('contain button to counter up', () => {
      wrapper.find({ className: 'upbuttonCounter' }).should.have.length(1)
    })

    it('contain button to counter down', () => {
      wrapper.find({ className: 'downbuttonCounter' }).should.have.length(1)
    })
  })
})
