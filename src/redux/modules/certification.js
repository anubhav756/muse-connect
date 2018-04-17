// imports
import { browserHistory } from 'react-router';
import onboardingApi from '../../containers/OnBoardingSteps/api';
import { notify } from './notice';
import { startSaving, endSaving } from './onBoarding';
import { updateUser } from './user';
import endPoints from '../../routes/endPoints';
import { cleverTapBusinessAndProfessionCompleted } from '../../libs/cleverTap'
// ------------------------------------
// Constants
// ------------------------------------
export const START_CERTIFICATION = 'START_CERTIFICATION'
export const END_CERTIFICATION = 'END_CERTIFICATION'

// ------------------------------------
// Actions
// ------------------------------------
export function addCertification(payload, done) {
  return (dispatch) => {
    dispatch(startSaving({ type: START_CERTIFICATION }));
    onboardingApi(payload)
      .end((error, res) => {
        dispatch(endSaving({ type: END_CERTIFICATION }));
        // server side validation to be updated
        if (!res || res.status !== 200) {
          if (
            res &&
            res.body &&
            res.body.errors && (
              res.body.errors.eligiblePro ||
              res.body.errors.certificationNum ||
              res.body.errors.certificationBody ||
              res.body.errors.businessName ||
              res.body.errors.businessType ||
              res.body.errors.generic
            )) {
            if (
              !res.body.errors.generic
            )
              return done(res.body.errors);
            done();
            return dispatch(notify({ message: res.body.error.generic }));
          }
          done();
          return dispatch(notify({ error }));
        }
        done();
        // logs BusinessAndProfession step Completion into clever tap
        cleverTapBusinessAndProfessionCompleted()
        dispatch(updateUser(res.body && res.body.me));
        browserHistory.push(`${endPoints.onboarding.index}/${endPoints.onboarding.subscription}`);
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  isFetching: false
};

const ACTION_HANDLERS = {
  [START_CERTIFICATION]: () => ({ ...initialState, isFetching: true }),
  [END_CERTIFICATION]: () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function certificationReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
