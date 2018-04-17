// ------------------------------------
// Constants
// ------------------------------------
export const SET_DIMENSION = 'SET_DIMENSION'

// ------------------------------------
// Actions
// ------------------------------------
export function setDimension(value) {
  return (dispatch) => {
    dispatch({
      type: SET_DIMENSION,
      payload: value
    })
  }
}

export const actions = {
  setDimension
}

// ------------------------------------
// Action Handlers
// ------------------------------------


const ACTION_HANDLERS = {
  [SET_DIMENSION]: (state, action) => {
    const payload = action.payload
    return ({ innerWidth: payload.innerWidth, innerHeight: payload.innerHeight })
  }
}


// ------------------------------------
// Reducer
// ------------------------------------
export default function registerReducer(state = {
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
