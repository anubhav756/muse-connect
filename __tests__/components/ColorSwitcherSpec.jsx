import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'

import ColorSwitcher from '../../src/containers/ShopStore/Widgets/ColorSwitcher'


const props = {
  imageOptions: [{ name: 'Color', values: ['Black', 'White'] }, { values: ['Black', 'White'] }],
  containerStyle: {},
  iconStyle: {},
  onColorSwitch: () => {},
  activeSlide: 0
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

describe('(Component) Color Switcher', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = propValues => (
    mount(<ColorSwitcher {...propValues} />, {
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

  it('should render two Icon buttons', () => {
    const wrapper = buildWrapper(props)
    wrapper.find(IconButton).should.have.length(2)
  })

  it('should set active slide index to 1', () => {
    // to be added
  })
})
