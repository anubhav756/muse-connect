import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

import ProductDetailsComponent from '../../../src/containers/ShopStore/ProductDetails'
import NoResultFoundCard from '../../../src/containers/ShopStore/Widgets/NoResultFoundCard'
import LoaderComponent from '../../../src/containers/ShopStore/Widgets/Loader'
import ProductCard from '../../../src/containers/ShopStore/Widgets/ProductCard'
import ColorSwitcher from '../../../src/containers/ShopStore/Widgets/ColorSwitcher'
import AddToCartButton from '../../../src/containers/ShopStore/Widgets/AddToCartButton'
import NumberCounter from '../../../src/containers/ShopStore/Widgets/NumberCounter'

import { productStore, user } from '../../../__mocks__/fixtures.json';
import { cartActions } from '../../../src/containers/ShopStore/libs/shopify'

jest.mock('../../../src/containers/ShopStore/libs/shopify')
jest.mock('../../../src/containers/ShopStore/api')

const shopifySpy = sinon.spy(cartActions, 'addItemsToCart')

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
  router: {
    push: () => { },
    replace: () => { },
    go: () => { },
    goBack: () => { },
    goForward: () => { },
    setRouteLeaveHook: () => { },
    isActive: () => { },
    location: { pathname: '/shop/1619813571' }
  }
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
  subscribe: () => { },
  dispatch: () => { }
}

describe('(Container) Product details', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<ProductDetailsComponent />, {
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
        subscribe: () => { },
        dispatch: () => { }
      })
    })

    it('render Loader component', () => {
      const wrapper = buildWrapper()
      wrapper.find(LoaderComponent).should.have.length(1)
    })
  })

  describe('Data has fetch, component', () => {
    let wrapper = ''
    beforeAll(() => {
      contextRef = getContext({
        getState: () => ({
          shopStore: {
            isFetching: false,
            isError: false,
            details: productStore,
            storeCountryCode: 'US'
          }
        }),
        subscribe: () => { },
        dispatch: () => { }
      })
      wrapper = buildWrapper()
    })
    it('should render Product Details component', () => {
      wrapper.find('.mainSectionProductDetails').should.have.length(1)
    })

    it('should render two other(You may like...) products', () => {
      wrapper.find(ProductCard).should.have.length(2)
    })

    it('should update colorSwitcherIndex', () => {
      wrapper.find('.mainSectionProductDetails').find(ColorSwitcher).props().onColorSwitch(1)
      wrapper.find('ProductDetails').instance().state.colorSwitcherIndex.should.equal(1)
    })

    it('should update number counter at state', () => {
      wrapper.find('.actionContainerProductDetails').find(NumberCounter).props().callBack(2)
      wrapper.find('ProductDetails').instance().state.productCount.should.equal(2)
    })

    it('should add item to cart', (done) => {
      setTimeout(() => {
        wrapper.find('.actionContainerProductDetails').find(AddToCartButton).getElement().props.onClick()
        wrapper.find('.actionContainerMobProductDetails').find(AddToCartButton).getElement().props.onClick()
        shopifySpy.should.be.calledTwice()
        done()
      }, 0)
    })
  })
})
