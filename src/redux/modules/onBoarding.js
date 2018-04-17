// ------------------------------------
// Constants
// ------------------------------------
export const ONBOARD_START_SAVING = 'ONBOARD_START_SAVING'
export const ONBOARD_END_SAVING = 'ONBOARD_END_SAVING'
// ------------------------------------
// Actions
// ------------------------------------
export function startSaving(formAction) {
  return (dispatch) => {
    dispatch(formAction);
    dispatch({ type: ONBOARD_START_SAVING });
  }
}

export function endSaving(formAction) {
  return (dispatch) => {
    dispatch(formAction);
    dispatch({ type: ONBOARD_END_SAVING });
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  isSaving: false
}

const ACTION_HANDLERS = {
  [ONBOARD_START_SAVING]: () => ({ isSaving: true }),
  [ONBOARD_END_SAVING]: () => ({ isSaving: false })
}
// ------------------------------------
// Reducer
// ------------------------------------
export default function onBoarding(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
