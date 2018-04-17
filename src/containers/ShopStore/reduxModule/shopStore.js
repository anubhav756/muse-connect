// ------------------------------------
// Imports
// ------------------------------------
import _ from 'lodash'
import { notify } from './shopStoreNotice'
import { getShopStore } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const SHOPSTORE_FETCH_START = 'SHOPSTORE_FETCH_START'
export const SHOPSTORE_ERROR = 'SHOPSTORE_ERROR'
export const SHOPSTORE_FETCH_END = 'SHOPSTORE_FETCH_END'
export const ADD_SHOPSTORE_COUNTRY = 'ADD_SHOPSTORE_COUNTRY'
// ------------------------------------
// Actions
// ------------------------------------

/*
 * @function reportShopStoreError
 * dispatch action to set error state
 */
export function reportShopStoreError() {
  return { type: SHOPSTORE_ERROR }
}

/*
 * @function startStoreFetch
 * dispatch action to set fetch state
*/
export function startStoreFetch() {
  return { type: SHOPSTORE_FETCH_START }
}

/*
 * @function endStoreFetch
 * dispatch action to set details into store
*/
export function endStoreFetch(value) {
  return { type: SHOPSTORE_FETCH_END, payload: value }
}

/*
 * @function addShopStoreCountry adds the country code to the store
 * @param {string} code
 */
export function addShopStoreCountry(code) {
  return { type: ADD_SHOPSTORE_COUNTRY, payload: code }
}

/*
 * @function fetchStore
 * controller function which controls the actions regarding signup
 */
export function fetchStore() {
  return (dispatch, getState) => {
    dispatch(startStoreFetch())
    const user = getState().user
    const countryCode = user && user.info && user.info.country
    dispatch(addShopStoreCountry(countryCode))
    Promise.resolve(getShopStore(countryCode))
    .then((res) => {
      if (res && res.body && res.body.data)
        dispatch(endStoreFetch(res.body.data))
    })
    .catch((error) => {
      dispatch(reportShopStoreError())
      dispatch(notify({ error }))
    })
  }
}

/*
 * @function getStore
 * controller function which checks if already store data is available saves the api call
 */
export function getStore() {
  return (dispatch, getState) => {
    const shopStore = getState().shopStore
    const shopStoreDetails = shopStore && shopStore.details
    if (_.isEmpty(shopStoreDetails)) {
      return dispatch(fetchStore())
    }
    dispatch(endStoreFetch(shopStoreDetails))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  isFetching: false,
  isError: false,
  details: {},
  storeCountryCode: null
}

const ACTION_HANDLERS = {
  [SHOPSTORE_FETCH_START]: () => ({ ...initialState, isFetching: true }),
  [SHOPSTORE_ERROR]: () => ({ ...initialState, isError: true }),
  [SHOPSTORE_FETCH_END]: (state, action) => (
    { ...state, details: action.payload, isFetching: false, isError: false }
  ),
  [ADD_SHOPSTORE_COUNTRY]: (state, action) => ({ ...state, storeCountryCode: action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function shopStoreReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
