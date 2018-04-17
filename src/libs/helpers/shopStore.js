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

export function getSingleHeadBand(products = []) {
  const main_product = []
  products.map((product = {}) => {
    if (product.handle === 'muse-the-brain-sensing-headband-single-headband') {
      main_product.push(product)
    }
    return ''
  })
  return main_product
}

export default {
  filterProducts,
  getSingleHeadBand
}
