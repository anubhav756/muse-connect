import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import _ from 'lodash'

import ContentLoaderComponent from './Widgets/Loader'
import NoResultFoundCard from './Widgets/NoResultFoundCard'
import ColorSwitcher from './Widgets/ColorSwitcher'
import ImageCarousel from './Widgets/ImageCarousel/ImageCarousel'
import NumberCounter from './Widgets/NumberCounter'
import ProductMetafield from './Widgets/ProductMetafield'
import ProductCard from './Widgets/ProductCard'
import AddToCartButton from './Widgets/AddToCartButton'

import { getStore } from './reduxModule/shopStore'
import getshopify from './libs/shopify'
import { notify } from './reduxModule/shopStoreNotice'

import './ProductDetails.scss'

/*
 * @function _getProduct
 * @param {string} id
 * @param {object} [products=[]]
 * @returns product if found else return empty object
 */
function _getProduct(id, products = []) {
  const index = _.findIndex(products, obj => (
    obj.id.toString() === id
  ))

  if (index === -1) {
    return {}
  }

  return products[index]
}
/*
 * @function getOtherProductItems
 * @param {object} [currentProduct={}]
 * @param {object} [AllProducts=[]]
 * @returns Product items for Other products item section
 */
function getOtherProductItems(currentProduct = {}, AllProducts = []) {
  const productItems = []
  AllProducts.map((product) => {
    if (product.id !== currentProduct.id) {
      productItems.push(
        <Col xs={12} md={4} sm={6} key={product.id}>
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
        </Col>)
    }
    return ''
  })
  return (
    <Row key={'accessoryItems'}>
      { productItems }
    </Row>
  )
}

/*
 * @function getProductItem
 * @param {object} [product={}]
 * @param {string} storeCountryCode
 * @param {object} [products=[]]
 * @returns the Selected product item
 */
function getProductItem(product = {}, storeCountryCode, products = []) {
  const { images, title, body_html, variants, options, id } = product
  const { colorSwitcherIndex } = this.state
  const True = true
  const imageSrc = images.map(image => (image.src && image.src))
  const price = variants && variants.length && variants[0].price
  return (
    <div>
      <div className="mainSectionProductDetails">
        <div className="imageContainerProductDetails">
          <div style={{ position: 'relative' }}>
            <div className="carouselContainerProdDetails">
              <div className="carouselImageProdDetails">
                <ImageCarousel arrows={True} settings={{ arrows: false, lazyLoad: True, swipe: imageSrc && imageSrc.length > 1, adaptiveHeight: 'true', infinite: false }} colorSwitcherIndex={colorSwitcherIndex} images={imageSrc} />
              </div>
            </div>
            <div className={'colorSwitchProductDetails'} >
              <ColorSwitcher imageOptions={options} containerStyle={{ width: '34px' }} iconStyle={{ width: '30px', height: '30px' }} onColorSwitch={this.handleColorSwitch} />
            </div>
          </div>
        </div>
        <div className="infoProductDetails" >
          <div className="infoActionsProductDetails">
            <div className="titleContainerProdDetails">
              <div className="titleProductDetails">
                {title}
              </div>
              <span className="priceRespProductDetails">
                {this.getPriceDetailItem(price)}
              </span>
            </div>
            <div className="subtitleContainerProdDetails" >
              <div className="subtitleProductDetails">
                {body_html}
              </div>
              <span className="priceProductDetails">
                {this.getPriceDetailItem(price)}
              </span>
            </div>
            <div className="actionContainerProductDetails">
              <div className="countContainerProdDetails">
                <span className="countLabelProductDetails">QUANTITY</span>
                <span className="countLabelResProductDetails">QTY</span>
                <div className="countItemProductDetails">
                  {this.getNumberCounterItem()}
                </div>
              </div>
              <div className="cartActionProductDetails">
                <AddToCartButton
                  onClick={() => this.handleCartAction(variants, images, title)}
                />
              </div>
            </div>
          </div>
          <div className="metafieldsProductDetails">
            <ProductMetafield countryCode={storeCountryCode} productId={id} />
          </div>
          <div className="actionContainerMobProductDetails">
            <div className="countContainerProdDetails">
              <span className="countLabelProductDetails">QUANTITY</span>
              <span className="countLabelResProductDetails">QTY</span>
              <div className="countItemProductDetails">
                {this.getNumberCounterItem()}
              </div>
            </div>
            <div className="cartActionContainerProductDetails">
              <div className="cartActionProductDetails">
                <AddToCartButton
                  onClick={() => this.handleCartAction(variants, images, title)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="otherItemSection">
        <div className="othItemTitleProductDetails">
          You might also like...
        </div>
        <div className="othItemsProductDetails">
          { this.getOtherProductItems(product, products) }
        </div>
      </div>
    </div>
  )
}

function getPriceDetailItem(price) {
  return `$${price}`
}

export class ProductDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // kept separate from count at number counter so that don't render number counter
      // again and again
      productCount: 1,
      colorSwitcherIndex: 0
    }
    // get shopify cart
    const { user } = props
    getshopify(user && user.info && user.info.country)
    .then((shopifyInstance) => {
      this.shopifyInstance = shopifyInstance
    })
    .catch(() => {
      props.notify()
    })
    this.handleColorSwitch = this.handleColorSwitch.bind(this)
    this.getProductItem = getProductItem.bind(this)
    this.handleNumberCounter = this.handleNumberCounter.bind(this)
    this.getOtherProductItems = getOtherProductItems.bind(this)
    this.handleCartAction = this.handleCartAction.bind(this)
    this.getNumberCounterItem = this.getNumberCounterItem.bind(this)
    this.getPriceDetailItem = getPriceDetailItem.bind(this)
  }

  componentWillMount() {
    // loads the product items into store
    this.props.getStore()
    // opens the page at top
    window.scrollTo(0, 0)
  }

  getNumberCounterItem() {
    return <NumberCounter count={1} callBack={this.handleNumberCounter} />
  }

   // add the item to the cart
  handleCartAction(variants, images, title) {
    const { colorSwitcherIndex, productCount } = this.state
    const image = images[colorSwitcherIndex]
    this.shopifyInstance.addItemsToCart({
      ...variants[colorSwitcherIndex],
      productId: variants[colorSwitcherIndex].product_id,
      image,
      productTitle: title
    }, productCount)
  }

  // handles the color switch component callBack
  handleColorSwitch(colorSwitcherIndex) {
    this.setState({ colorSwitcherIndex })
  }
  // handles the number counter component callBack
  handleNumberCounter(value) {
    this.setState({ productCount: value })
  }

  render() {
    const { router } = this.context
    const { isFetching, details, storeCountryCode } = this.props.shopStore
    const endPoints = router.location && router.location.pathname && router.location.pathname.split('/')
    if (isFetching) {
      return (
        <div>
          <ContentLoaderComponent />
        </div>
      )
    }

    const product = _getProduct(endPoints[2], details.products)
    return (
      <div>
        {
          (_.isEmpty(product))
          ? <div>
            <NoResultFoundCard />
          </div>
          : <div>
            {this.getProductItem(product, storeCountryCode, details.products)}
          </div>
        }
      </div>
    )
  }
}

ProductDetails.contextTypes = {
  router: PropTypes.object.isRequired
}

ProductDetails.propTypes = {
  notify: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  shopStore: PropTypes.object.isRequired,
  getStore: PropTypes.func.isRequired
}

function mapStateToProps({ shopStore, user }) {
  return { shopStore, user }
}

export default connect(mapStateToProps, { getStore, notify })(ProductDetails)
