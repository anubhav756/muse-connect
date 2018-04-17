import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import Divider from 'material-ui/Divider'

import Loader from '../Loader'
import NoResultFoundCard from '../NoResultFoundCard'
import { getProductMetafields } from '../../api'
import ListItemAccordian from '../ListItemAccordian'
import { notify } from '../../reduxModule/shopStoreNotice'

// store the mapping of metafield namespaces to the metafield primaryText to be shown at screen
const metafieldMap = {
  productBullets: 'About the product',
  box: "What's in the box",
  shipping: 'Shipping information',
  specs: 'Specifications'
}

// create and returns the Metafield items from the metafields received from api
function getMetafieldItems(metafields) {
  const metafieldItems = {}
  // creates the metafieldItems object from metafield array gets from api
  metafields.map((metafieldValue) => {
    const metafield = metafieldValue
    metafield.namespace = metafieldMap[metafield.namespace] || metafield.namespace
    // if namespace not exist creates a new entry
    if (!metafieldItems[metafield.namespace]) {
      metafieldItems[metafield.namespace] = {}
      metafieldItems[metafield.namespace].namespace = metafield.namespace
      metafieldItems[metafield.namespace].value = {}
      metafieldItems[metafield.namespace].key = metafield.id
      metafieldItems[metafield.namespace].value[metafield.key] = [metafield.value]
      metafieldItems[metafield.namespace].priority = metafield.key // sets the priority
    } else if (metafieldItems[metafield.namespace].value[metafield.key]) {
      // namespace exist also the value is already set at priority
      metafieldItems[metafield.namespace].value[metafield.key].push(`<br />${metafield.value}`)
    } else {
      // namespace exist but the value at given priority is not set
      if (metafieldItems[metafield.namespace].priority > metafield.key) {
        // updates the priority
        metafieldItems[metafield.namespace].priority = metafield.key
      }
      // adds the value
      metafieldItems[metafield.namespace].value[metafield.key] = [metafield.value]
    }
    return ''
  })
  // sort the keys on the basis of priority
  const sortedMetafieldItems = _.sortBy(metafieldItems, ['priority'])
  // gets the html
  return sortedMetafieldItems.map(item => (
    <ListItemAccordian
      key={item.key}
      primaryText={item.namespace}
      content={<div
        dangerouslySetInnerHTML={{
          __html: (() => (
            Object.keys(item.value).sort().map(key => (
              `${item.value[key]}<br />`
            ))
          ))()
        }}
      />}
    />
  ))
}

export class ProductMetafield extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isError: false,
      isFetching: false,
      details: {}
    }
    this.getMetafields = this.getMetafields.bind(this)
  }

  componentWillMount() {
    const { countryCode, productId } = this.props
    // get the metafields as component mounts
    this.getMetafields(countryCode, productId)
  }

  componentWillReceiveProps(nextProps) {
    // gets the new metafields if selected product changes
    if (nextProps.productId !== this.props.productId) {
      const { countryCode, productId } = nextProps
      this.getMetafields(countryCode, productId)
    }
  }
  // makes the api call and gets the metafields specific to product
  getMetafields(storeName, productId) {
    this.setState({ isFetching: true })
    getProductMetafields(storeName, productId)
    .then((res) => {
      this.setState({ isFetching: false, details: res && res.body && res.body.data })
    })
    .catch((error) => {
      this.props.notify({ error })
      this.setState({ isError: true, isFetching: false })
    })
  }

  render() {
    const { isError, isFetching, details } = this.state

    if (isFetching) {
      return (
        <div>
          <Loader zDepth={0} />
        </div>
      )
    }

    const metafields = (details && details.metafields) || []
    if (isError || _.isEmpty(metafields)) {
      return (
        <div>
          <NoResultFoundCard text="Product information could not load !" zDepth={0} />
        </div>
      )
    }

    return (
      <div>
        { getMetafieldItems(metafields) }
        <Divider />
      </div>
    )
  }
}

ProductMetafield.defaultProps = {
  secondaryText: '',
  content: {}
}

ProductMetafield.propTypes = {
  productId: PropTypes.number.isRequired,
  countryCode: PropTypes.string.isRequired,
  notify: PropTypes.func.isRequired
}

export default connect(null, { notify })(ProductMetafield)
