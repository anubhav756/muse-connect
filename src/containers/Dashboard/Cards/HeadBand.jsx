import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getStore } from '../../ShopStore/reduxModule/shopStore'
import { getSingleHeadBand } from '../../../libs/helpers/shopStore'

import Loader from '../../../components/Loader/ContentLoader'
import NoResultFound from '../../../components/NoResultFoundCard'
import ProductCard from '../../ShopStore/Widgets/ProductCard'

function getHeadBandItem(products = []) {
  const True = true
  const product = products[0]
  if (!product) {
    return false
  }
  return (
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
    />
  )
}

function getHeadBand(details) {
  const products = details.products || []
  const filteredProduct = getSingleHeadBand(products)
  return getHeadBandItem(filteredProduct)
}

export class HeadBand extends React.Component {

  constructor(props) {
    super(props)
    this.getHeadBand = getHeadBand.bind(this)
  }
  componentWillMount() {
    this.props.getStore()
  }

  render() {
    const { isFetching, details } = this.props.shopStore
    if (isFetching) {
      return (
        <div style={{ margin: '15px 5px' }}>
          <Loader style={{ height: '431px', paddingTop: '200px' }} />
        </div>
      )
    }

    let product = false
    if (!_.isEmpty(details)) {
      product = this.getHeadBand(details)
    }
    return (
      <div>
        {
          !product
          ? <div style={{ margin: '15px 5px' }}>
            <NoResultFound text={'No product found'} style={{ height: '431px', paddingTop: '200px' }} />
          </div>
          : <div>
            {product}
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps({ shopStore }) {
  return { shopStore }
}

export default connect(mapStateToProps, { getStore })(HeadBand)

HeadBand.propTypes = {
  shopStore: PropTypes.object.isRequired,
  getStore: PropTypes.func.isRequired
}
