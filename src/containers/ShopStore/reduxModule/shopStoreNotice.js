// ------------------------------------
// Constants
// ------------------------------------
export const OPEN_STORE_NOTICE = 'OPEN_STORE_NOTICE'
export const CLOSE_STORE_NOTICE = 'CLOSE_STORE_NOTICE'

const MESSAGE = 'Sorry, something went wrong. Please try again. If you keep seeing this error, contact us at customercare@choosemuse.com'
const SHOW_CONTACT_MESSAGE = 'If you keep seeing this error, contact us at customercare@choosemuse.com'
// ------------------------------------
// Actions
// ------------------------------------

/*
 * @export function notify
 * @param {string} message text to be shown at snack bar
 * @returns {object} action which opens the snackbar at the bottom of the app
 */
export function notify(value = {}) {
  const { error = {}, message = MESSAGE } = value
  let errMsg = ''
  if (error.response &&
     error.response.body &&
     error.response.body.error &&
     error.response.body.error.message
  ) {
    errMsg = error.response.status === 500 ? `${error.response.body.error.message} ${SHOW_CONTACT_MESSAGE}` : error.response.body.error.message
  }
  return (dispatch) => {
    dispatch({
      type: OPEN_STORE_NOTICE,
      payload: errMsg || message
    })
  }
}

/*
 * @export function closeNotice
 * @returns {object} action closes the snackbar
 */
export function closeNotice() {
  return {
    type: CLOSE_STORE_NOTICE
  }
}

// ------------------------------------
// export Actions
// ------------------------------------
export const actions = {
  notify,
  closeNotice
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  open: false,
  message: ''
}

const ACTION_HANDLERS = {
  [OPEN_STORE_NOTICE]: (state, action) => ({ ...state, open: true, message: action.payload }),
  [CLOSE_STORE_NOTICE]: () => ({ ...initialState })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function notifyReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
