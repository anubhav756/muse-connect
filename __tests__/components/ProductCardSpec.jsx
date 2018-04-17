import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import ProductCard from '../../src/containers/ShopStore/Widgets/ProductCard'
import AddToCartButton from '../../src/containers/ShopStore/Widgets/AddToCartButton'
import NumberCounter from '../../src/containers/ShopStore/Widgets/NumberCounter'
import ColorSwitcher from '../../src/containers/ShopStore/Widgets/ColorSwitcher'

jest.mock('../../src/containers/ShopStore/libs/shopify')


const props = {
  id: 1,
  title: 'Muse Headband',
  subtitle: 'Muse Headband',
  images: [{ src: 'abc.jpg' }],
  price: '240',
  type: 'main_product',
  quantity: true,
  options: [],
  variants: [{ product_id: 1 }, { product_id: 2 }]
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
    },
    user: {}
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) ProductCard', () => {
  let contextRef = getContext(store)
  let wrapper = null
  const buildWrapper = propValues => (
    mount(<ProductCard {...propValues} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )
  beforeAll(() => {
    contextRef = getContext(store)
    wrapper = buildWrapper(props)
  })

  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  it('add to cart button should render', () => {
    wrapper.find(AddToCartButton).should.have.length(1)
  })
  it('should call handleCartAction onClick of AddToCartButton', () => {
    wrapper.find(AddToCartButton).getElement().props.onClick()
  })
  it('Number counter component should be rendered', () => {
    wrapper.find(NumberCounter).should.have.length(1)
  })
  it('should call handleNumberCounter callback of NumberCounter', () => {
    wrapper.find(NumberCounter).getElement().props.callBack(2)
    wrapper.find('ProductCard').instance().state.productCount.should.equal(2)
  })
  it('ColorSwitcher component should be rendered', () => {
    wrapper.find(ColorSwitcher).should.have.length(1)
  })
  it('should call handleColorSwitcher onColorSwitch of NumberCounter', () => {
    wrapper.find(ColorSwitcher).getElement().props.onColorSwitch(0)
    wrapper.find('ProductCard').instance().state.colorSwitcherIndex.should.equal(0)
  })
})
