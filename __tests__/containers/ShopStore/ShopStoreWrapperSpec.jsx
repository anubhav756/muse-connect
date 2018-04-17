import React from 'react'
import { shallow } from 'enzyme'
import PropTypes from 'prop-types'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import ShopStoreWrapper from '../../../src/containers/ShopStore'
import ShopStoreContentComponent from '../../../src/containers/ShopStore/ShopStoreContent'
import Notice from '../../../src/containers/ShopStore/Widgets/Notice'


const context = {
  store: {
    getState: () => ({ }),
    subscribe: () => {},
    dispatch: () => {}
  },
  muiTheme: getMuiTheme(),
  router: { location: { pathname: '/shop' }, routes: [{ path: '/shop:id' }, { path: '/shop' }] }
}

describe('(Container) ShopStoreWrapper', () => {
  let contextRef = context

  beforeAll(() => {
    contextRef = context
  })

  const buildWrapper = () => (
    shallow(<ShopStoreWrapper />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        router: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })

  it('should render ShopStoreContent component', () => {
    const wrapper = buildWrapper()
    wrapper.find(ShopStoreContentComponent).should.have.length(1)
  })

  it('should render Notice component', () => {
    const wrapper = buildWrapper()
    wrapper.find(Notice).should.have.length(1)
  })
})
