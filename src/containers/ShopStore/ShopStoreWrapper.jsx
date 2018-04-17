import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-flexbox-grid'

import ShopStoreContentComponent from './ShopStoreContent'
import ProductDetailsComponent from './ProductDetails'
import Notice from './Widgets/Notice'
import './ShopStoreWrapper.scss'
import PageTitle from '../../components/PageTitle'
import endpoints from '../../routes/endPoints'

export default function ShopStoreWrapper(props, context = { router: { location: { pathname: '' } } }) {
  const endPoint = context.router.location.pathname.split('/')
  const route = [...context.router.routes].pop().path;

  return (
    <Row>
      <Notice />

      {route === '/shop' &&
        <Col className="containerStore" xs={12} >
          <PageTitle className="storeTitle" text="Store" />
            <div className="storeText">
              <p>As a member of Muse Connect, you have access to preferred pricing on Muse for your practice. The discounted pricing is designed to help you make Muse available to your clients for use within the office, or on loan to promote at home practice. If your client wishes to keep a Muse for themselves, simply send them a referral link by adding them as a client, or purchase for them and have them reimburse you. If you wish to become a reseller of Muse, please contact us at <a href="mailto:professionals@choosemuse.com">professionals@choosemuse.com</a>.</p>
              <p>Muses are available below in singles, or case packs of 6 at a deeper discount. If you wish to place larger volume orders, please contact us.</p>
            </div>
          <ShopStoreContentComponent />
        </Col>
      }

      {route === '/shop/:id' &&
        <Col className="detailsProductStore" xs={12} >
          <PageTitle className={'titleHeaderProductDetails'} text="Store" backLink={endpoints.shop} />
          <ProductDetailsComponent endpoints={endPoint} />
        </Col>
      }
    </Row>
  )
}

ShopStoreWrapper.contextTypes = {
  router: PropTypes.object.isRequired
}
