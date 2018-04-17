import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import ShopStoreContentComponent from '../../../src/containers/ShopStore/ShopStoreContent'
import NoResultFoundCard from '../../../src/containers/ShopStore/Widgets/NoResultFoundCard'
import LoaderComponent from '../../../src/containers/ShopStore/Widgets/Loader'
import ProductCard from '../../../src/containers/ShopStore/Widgets/ProductCard'
import { productStore, user } from '../../../__mocks__/fixtures.json';


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
    },
    user
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) ShopStoreContent', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<ShopStoreContentComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })

  it('should render No result found card', () => {
    const wrapper = buildWrapper()
    wrapper.find(NoResultFoundCard).should.have.length(1)
  })

  describe('Data is fetching component should', () => {
    beforeAll(() => {
      contextRef = getContext({
        getState: () => ({
          shopStore: {
            isFetching: true,
            isError: false,
            details: {},
            storeCountryCode: null
          }
        }),
        subscribe: () => {},
        dispatch: () => {}
      })
    })

    it('render Loader component', () => {
      const wrapper = buildWrapper()
      wrapper.find(LoaderComponent).should.have.length(1)
    })
  })

  describe('Data has fetch component', () => {
    beforeAll(() => {
      contextRef = getContext({
        getState: () => ({
          shopStore: {
            isFetching: false,
            isError: false,
            details: productStore,
            storeCountryCode: null
          }
        }),
        subscribe: () => {},
        dispatch: () => {}
      })
    })

    it('should render Product card component', () => {
      const wrapper = buildWrapper()
      wrapper.find(ProductCard).should.have.length(3)
    })
  })
})
