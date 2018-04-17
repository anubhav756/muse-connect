// ------------------------------------
// Constants
// ------------------------------------
export const HIDE_BIG_SHIFT = 'HIDE_BIG_SHIFT';

// ------------------------------------
// Actions
// ------------------------------------
export function hideBigShift() {
  return (dispatch) => {
    dispatch({ type: HIDE_BIG_SHIFT })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  showBigShift: true
}

const ACTION_HANDLERS = {
  [HIDE_BIG_SHIFT]: () =>
    ({ showBigShift: false })
}
// ------------------------------------
// Reducer
// ------------------------------------
export default function bigShiftReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
