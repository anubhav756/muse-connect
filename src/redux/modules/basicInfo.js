// imports
import { browserHistory } from 'react-router';
import onboardingApi from '../../containers/OnBoardingSteps/api';
import { startSaving, endSaving } from './onBoarding'
import { notify } from './notice';
import { updateUser } from './user';
import endPoints from '../../routes/endPoints';
import { cleverTapBasicInfoCompleted } from '../../libs/cleverTap'
// ------------------------------------
// Constants
// ------------------------------------
export const START_COMPLETE_REGISTERING = 'START_COMPLETE_REGISTERING'
export const END_COMPLETE_REGISTERING = 'END_COMPLETE_REGISTERING'

// ------------------------------------
// Actions
// ------------------------------------
export function doCompleteRegister(payload, done = () => { }) {
  return (dispatch) => {
    // sets onBoarding isSaving state
    dispatch(startSaving({ type: START_COMPLETE_REGISTERING }))
    Promise.resolve(onboardingApi(payload))
      .then((res) => {
        // add the details to the store
        dispatch(updateUser(res.body && res.body.me))
        // unSets onBoarding isSaving state
        dispatch(endSaving({ type: END_COMPLETE_REGISTERING }))
        // callback to support submission error
        done()
        // logs basic info step completion into Clever tap
        cleverTapBasicInfoCompleted()
        // redirect user to the next step
        browserHistory.push(`${endPoints.onboarding.index}/${endPoints.onboarding.certification}`)
      })
      .catch((error) => {
        // callback to support submission error
        done(error && error.response && error.response.body && error.response.body.errors)
        // opens Snackbar
        dispatch(notify({ error }))
        // unSets onBoarding isSaving state
        dispatch(endSaving({ type: END_COMPLETE_REGISTERING }))
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  isRegistering: false
};

const ACTION_HANDLERS = {
  [START_COMPLETE_REGISTERING]: () => ({ ...initialState, isRegistering: true }),
  [END_COMPLETE_REGISTERING]: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function notifyReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
