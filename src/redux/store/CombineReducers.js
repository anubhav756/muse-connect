import { combineReducers } from 'redux'
import reducers from '../modules'

const appReducer = combineReducers({ ...reducers })

const rootReducer = (state, action) => {
  let appState = state
  if (action.type === 'USER_LOGOUT') {
    appState = undefined
  }

  return appReducer(appState, action)
}

export default function CombineReducers() {
  return rootReducer
}
