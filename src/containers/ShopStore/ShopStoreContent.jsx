import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Row, Col } from 'react-flexbox-grid'

import ProductCard from './Widgets/ProductCard'
import ContentLoaderComponent from './Widgets/Loader'
import NoResultFoundCard from './Widgets/NoResultFoundCard'

import { getStore } from './reduxModule/shopStore'

/*
 * @function filterProducts
 * @param {array} [products=[]] stores the products detail
 * @returns {object} having filtered arrays of product details as(main_product, accessories)
 */
export function filterProducts(products = []) {
  const main_product = []
  const accessories = []
  products.map((product = {}) => {
    if (product.handle === 'muse-hard-carrying-case-single' || product.handle === 'muse-case-pack-6x') {
      main_product.push(product)
    } else {
      accessories.push(product)
    }
    return ''
  })
  return { main_product, accessories }
}

/*
 * @function getMainProductItems
 * @param {array} [products=[]] stores the products detail
 * @returns Product item suppose to be render
 */
function getMainProductItems(products = []) {
  const True = true
  return (
    <Row key={'mainProductItems'}>
      {
        products.map(product => (
          <Col xs={12} sm={6} key={product.id}>
            <ProductCard
              id={product.id}
              title={product.title}
              subtitle={product.body_html}
              price={product.variants && product.variants.length && product.variants[0].price}
              images={product.images || []}
              options={product.options}
              quantity={True}
              type={'main_product'}
              variants={product.variants}
              carouselSetting={{ arrows: true }}
              arrows={True}
            />
          </Col>
        ))
      }
    </Row>
  )
}

/*
 * @function getAccessoryItems
 * @param {array} [products=[]] stores the products detail
 * @returns Product item suppose to be render
 */
function getAccessoryItems(products = []) {
  const True = true
  return (
    <Row key={'accessoryItems'}>
      {
        products.map(product => (
          <Col xs={12} sm={6} key={product.id}>
            <ProductCard
              id={product.id}
              title={product.title}
              subtitle={product.body_html}
              price={product.variants && product.variants.length && product.variants[0].price}
              images={product.images || []}
              options={product.options}
              quantity={True}
              type={'main_product'}
              variants={product.variants}
              carouselSetting={{ arrows: true }}
              arrows={True}
            />
          </Col>
        ))
      }
    </Row>
  )
}
/* commented for now, to be used if needed
  <ProductCard
    id={product.id}
    title={product.title}
    subtitle={product.body_html}
    price={product.variants && product.variants.length && product.variants[0].price}
    images={product.images || []}
    options={product.options}
    type={'accessory'}
    variants={product.variants}
  />
*/
/*
 * @function getStoreItems
 * @param {object} [details={}]
 * @returns
 */
export function getStoreItems(details = {}) {
  const products = details.products || []
  const filteredProducts = filterProducts(products)
  const mainProductItems = getMainProductItems(filteredProducts.main_product)
  const accessoryItems = getAccessoryItems(filteredProducts.accessories)
  return ([mainProductItems, accessoryItems])
}

export class ShopStoreContent extends Component {

  constructor(props) {
    super(props)
    this.getStoreItems = getStoreItems.bind(this)
  }

  componentWillMount() {
    this.props.getStore()
  }

  render() {
    const { isFetching, details } = this.props.shopStore
    if (isFetching) {
      return (
        <Row>
          <Col xs={12} >
            <ContentLoaderComponent />
          </Col>
        </Row>
      )
    }

    return (
      <Row>
        {
          _.isEmpty(details)
          ? <Col xs={12}>
            <NoResultFoundCard />
          </Col>
          : <Col xs={12}>
            { this.getStoreItems(details) }
          </Col>
        }
      </Row>
    )
  }
}

function mapStateToProps({ shopStore }) {
  return { shopStore }
}

export default connect(mapStateToProps, { getStore })(ShopStoreContent)

ShopStoreContent.propTypes = {
  shopStore: PropTypes.object.isRequired,
  getStore: PropTypes.func.isRequired
}
