// ------------------------------------
// Imports
// ------------------------------------
/* eslint-disable */
import _ from 'lodash'
import storeInfo from './stores'
import colors from '!!sass-variable-loader!./../../../styles/variables//colors.scss'
import { cleverTapAddToCart, cleverTapCheckout } from '../../../libs/cleverTap'

let shopify = null
let uiInstance = null
let cartInstance = null

class Shopify {
  constructor(countryCode) {
    this.countryCode = countryCode // sets the countryCode
  }

  // returns the cart via callBack also follows singleton
  getCart(callBack = () => {}) {
    if (!_.isEmpty(cartInstance)) {
      return callBack(cartInstance)
    }
    const ui = this.getUiInstance()
    const cartPromise = ui.createComponent('cart', {
      node: document.getElementById('cart'),
      options: {
        cart: {
          startOpen: false,
          styles: {
            button: {
              'background-color': colors.teal,
            }
          },
          events: {
            openCheckout: () => { cleverTapCheckout() } // logs event into clever tap as user checkout from cart.
          }
        },
        toggle: {
          styles: {
            toggle: {
              'background-color': colors.teal,
              ':hover': {
                'background-color': colors.teal
              }
            }
          }
        }
      }
    })
    cartPromise.then((cartItem) => {
      callBack(cartItem)
      cartInstance = cartItem
    })
  }
  /*
   * @function destroyCart deletes the shopify store instance and removes it from DOM
   * @memberOf Shopify
   */
  destroyCart() {
    if (cartInstance) {
      cartInstance.destroy()
      cartInstance.empty()
      cartInstance = null
      shopify = null
      uiInstance = null
    }
  }
  // creates the instance of shopify store
  createUiInstance() {
    const info = storeInfo[this.countryCode] || storeInfo.US
    const client = ShopifyBuy.buildClient({
      apiKey: info.accessToken,
      domain: info.domain,
      appId: '6'
    });
    return ShopifyBuy.UI.init(client)
  }

  getUiInstance() {
    if (!_.isEmpty(uiInstance)) {
      return uiInstance
    }
    uiInstance = this.createUiInstance()
    return uiInstance
  }
  // adds the product item to cart
  addItemsToCart(product, count) {
    this.getCart((cartItem) => {
      cleverTapAddToCart() // logs event into clever tap as item get added to cart
      cartItem.addVariantToCart(product, count)
    })
  }
}

/*
 * @function getShopifyInstance
 * @returns the instance of shopify store, follows singleton pattern
 */
export default function getShopifyInstance(countryCode) {
  if (shopify) {
    return shopify
  }
  const shopifyObj = new Shopify(countryCode)
  return shopify =  new Promise((resolve, reject) => {
    shopifyObj.getCart((cartInstance) => {
      resolve(shopifyObj)
    })
  })
}
