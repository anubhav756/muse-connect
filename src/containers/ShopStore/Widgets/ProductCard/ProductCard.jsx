import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Card } from 'material-ui/Card'

import ColorSwitcher from '../ColorSwitcher'
import AddToCartButton from '../AddToCartButton'
import ImageCarousel from '../ImageCarousel/ImageCarousel'
import NumberCounter from '../NumberCounter'
import getshopify from '../../libs/shopify'
import { notify } from '../../reduxModule/shopStoreNotice'
import { redirectToProductPage } from '../../../../libs/helpers/redirect'

import './ProductCard.scss'

export class ProductCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // kept separate from count at number counter so that don't render number counter
      // again and again
      productCount: 1,
      colorSwitcherIndex: 0
    }
    this.handleNumberCounter = this.handleNumberCounter.bind(this)
    this.handleColorSwitch = this.handleColorSwitch.bind(this)
    this.handleCartAction = this.handleCartAction.bind(this)
    // get shopify cart
    const { user } = props
    getshopify(user && user.info && user.info.country)
    .then((shopifyInstance) => {
      this.shopifyInstance = shopifyInstance
    })
    .catch(() => {
      props.notify()
    })
  }

  handleNumberCounter(value) {
    this.setState({ productCount: value })
  }

  handleColorSwitch(colorSwitcherIndex) {
    this.setState({ colorSwitcherIndex })
  }

  handleCartAction() {
    const { colorSwitcherIndex, productCount } = this.state
    const { variants, images, title } = this.props
    const image = images[colorSwitcherIndex]
    if (this.shopifyInstance) {
      this.shopifyInstance.addItemsToCart({
        ...variants[colorSwitcherIndex],
        productId: variants[colorSwitcherIndex].product_id,
        image,
        productTitle: title
      }, productCount)
    }
  }

  render() {
    const { id, title, subtitle, images, price, quantity, options, type, arrows } = this.props
    const { colorSwitcherIndex } = this.state
    const imageSrc = images.map(image => (image.src && image.src))
    const True = true
    return (
      <Card className={type === 'main_product' ? 'containerMainProduct' : 'containerAccessoryProduct'}>
        <div>
          <div>
            <div className="carouselContainerProduct" >
              <div className="carouselImageProduct" >
                <ImageCarousel id={id} settings={{ arrows: false, lazyLoad: True, swipe: imageSrc && imageSrc.length > 1, adaptiveHeight: 'true', infinite: false }} arrows={arrows} colorSwitcherIndex={colorSwitcherIndex} images={imageSrc} />
              </div>
            </div>
            <div className={'colorSwitcherProduct'} >
              <ColorSwitcher imageOptions={options} containerStyle={{ width: '34px' }} iconStyle={{ width: '30px', height: '30px' }} onColorSwitch={this.handleColorSwitch} />
            </div>
          </div>
          <div className="bodySectionProduct">
            <div className="titleContainerProduct">
              <div className={'titleProduct'} onClick={() => { redirectToProductPage(id) }}>
                {title}
              </div>
              {
                quantity && <span className="pricedetailsProduct">{`$${price}`}</span>
              }
            </div>
            {
              subtitle &&
              <div className="subtitleContainerProduct" >
                <div className="subtitleProduct" onClick={() => { redirectToProductPage(id) }} >
                  {subtitle}
                </div>
              </div>
            }
            <div className="detailContainerProduct">
              <div className="detailItemProduct">
                <div onClick={() => { redirectToProductPage(id) }} className="viewDetailsProduct">
                  <span>View more details</span>
                </div>
              </div>
              {
                quantity &&
                  <span className="pricedetailsProduct">{`$${price}`}</span>
              }
            </div>
          </div>
          <div className="actionContainerProduct">
            <div className="actionItemProduct" >
              {
                quantity
                ? <div>
                  <span className="counterLabelProduct">QUANTITY</span>
                  <span className="counterLabelResponsiveProduct">QTY</span>
                  <div className="counterItemProduct">
                    <NumberCounter count={1} callBack={this.handleNumberCounter} />
                  </div>
                </div>
                : <div className="pricedetailsProduct">{`$${price}`}</div>
              }
            </div>
            <div className={type === 'main_product' ? 'mainCartActionProduct' : 'accessoryCartActionProduct'} >
              <AddToCartButton
                onClick={this.handleCartAction}
              />
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

ProductCard.defaultProps = {
  quantity: false,
  subtitle: '',
  arrows: true
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  images: PropTypes.array.isRequired,
  price: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  quantity: PropTypes.bool,
  options: PropTypes.array.isRequired,
  variants: PropTypes.array.isRequired,
  notify: PropTypes.func.isRequired,
  arrows: PropTypes.bool
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps, { notify })(ProductCard)
