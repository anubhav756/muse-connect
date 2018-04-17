// ------------------------------------
// Constants
// ------------------------------------
export const RESET_TUTORIAL_CARDS = 'RESET_TUTORIAL_CARDS'
export const SET_TUTORIAL_CARDS = 'SET_TUTORIAL_CARDS'
export const Close_TUTORIAL_CARDS = 'Close_TUTORIAL_CARDS'

export const TutorialCards = {
  dashboardSideBar: 'dashboardSideBar',
  activeClient: 'activeClient',
  clientActivity: 'clientActivity'
}
// ------------------------------------
// Actions
// ------------------------------------
export function setTutorialCards(values) {
  return (dispatch) => {
    dispatch({ type: SET_TUTORIAL_CARDS, payload: values })
  }
}

export function closeTutorialCards(key) {
  return (dispatch) => {
    dispatch({ type: Close_TUTORIAL_CARDS, payload: key })
  }
}

export function resetTutorialCard() {
  return (dispatch) => {
    dispatch({ type: RESET_TUTORIAL_CARDS })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
export const initialState = {
  tutorialCards: {}
}

const ACTION_HANDLERS = {
  [SET_TUTORIAL_CARDS]: (state, action) => ({ ...state, tutorialCards: action.payload }),
  [Close_TUTORIAL_CARDS]: (state, action) => {
    const cards = Object.assign({}, state.tutorialCards)
    if (cards[action.payload]) {
      delete cards[action.payload]
    }
    return ({ ...state, tutorialCards: cards })
  },
  [RESET_TUTORIAL_CARDS]: () => (initialState)
}
// ------------------------------------
// Reducer
// ------------------------------------
export default function tutorialReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
