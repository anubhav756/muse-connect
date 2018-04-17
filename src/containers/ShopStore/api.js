import apiCall from '../../libs/api/apiRequest';

import storeInfo from './libs/stores'

// api call makes get request to get details of Product Store with
// respect to country code and collection id
export function getShopStore(value) {
  const endpoint = 'store/products'
  const method = 'get'
  let store = storeInfo.US.store
  let collectionId = storeInfo.US.collectionId
  let query = { store, collectionId }

  if (value === 'CA') {
    store = storeInfo.CA.store
    collectionId = storeInfo.CA.collectionId
    query = { store, collectionId }
  }

  return apiCall({ endpoint, method, query })
}

// api call makes get request to fetch country code of current login user
export function getProductMetafields(storeName, productId) {
  const endpoint = 'store/metafields'
  const method = 'get'
  let store = 'US'
  if (storeName === 'CA') {
    store = 'CA'
  }
  const query = { store, productId }
  return apiCall({ endpoint, method, query })
}

export default {
  getShopStore,
  getProductMetafields
}
