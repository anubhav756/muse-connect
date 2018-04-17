// imports
import { browserHistory } from 'react-router'
import getMeApi from '../../containers/SignIn/api';
import getShopify from '../../containers/ShopStore/libs/shopify'
import { cleverTapLogout, cleverTapLoginProfile } from '../../libs/cleverTap'
import { notify } from '../../redux/modules/notice'
import endPoints from '../../routes/endPoints'
import { isTokenUnavailable } from '../../libs/helpers/auth'
import { createAmbassadorUserObj, addAmbassadorVarToWindow, removeAmbassadorVarFromWindow } from '../../libs/helpers/ambassador'
// ----------------------------- -------
// Constants
// ------------------------------------
export const FETCH_USER = 'FETCH_USER'
export const ERROR_USER = 'ERROR_USER'
export const UPDATE_USER = 'UPDATE_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function updateUser(payload) {
  return (dispatch) => {
    if (payload) {
      dispatch({ type: UPDATE_USER, payload })
      const userObject = createAmbassadorUserObj(payload)
      addAmbassadorVarToWindow(userObject)
    }
  }
}

function closeStripeModal() {
  const modals = document.getElementsByClassName('stripe_checkout_app')
  for (let index = 0; index < modals.length; index++) {
    modals[index].style.display = 'none'
  }
}

export function logoutUser({ notificationMsg, redirectUrl }) {
  cleverTapLogout() // logout from clever tap
  return (dispatch) => {
    // clear storage
    localStorage.clear()
    // Clear store
    dispatch({ type: 'USER_LOGOUT' })
    if (notificationMsg)
      dispatch(notify({ message: notificationMsg }))

    removeAmbassadorVarFromWindow()

    closeStripeModal()
    // Destroy shopify card
    getShopify()
      .then((shopifyInstance) => {
        shopifyInstance.destroyCart()
      })
    // redirect to signin page
    browserHistory.push(redirectUrl || endPoints.signin)
  }
}

export function fetchUser(done = () => {}, update = false) {
  return (dispatch, getState) => {
    const { user: { info } } = getState();
    if (info && !update)
      return done()

    if (isTokenUnavailable()) {
      dispatch(logoutUser({ notificationMsg: 'You must sign in first', redirectUrl: `${endPoints.signin}?redirect=${window.location.pathname}` }))
      return dispatch({ type: ERROR_USER });
    }
    dispatch({ type: FETCH_USER })
    getMeApi()
      .then((res) => {
        // creates new user session and push the user details into clever tap so that user can be
        // identified for the events
        // happen before onboard completion
        cleverTapLoginProfile(res.body.me)
        // save user into redux store
        dispatch(updateUser(res.body.me))
        done()
      })
      .catch((error) => {
        dispatch({ type: ERROR_USER })
        done(true)
        return dispatch(notify({ error }))
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
export const initialState = {
  isFetching: false,
  isError: false,
  info: null
}

const ACTION_HANDLERS = {
  [FETCH_USER]: () => ({ ...initialState, isFetching: true }),
  [ERROR_USER]: () => ({ ...initialState, isError: true }),
  [UPDATE_USER]: (state, action) => ({ ...initialState, info: action.payload })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
