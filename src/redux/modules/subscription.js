// imports
import _ from 'lodash'
import { notify } from './notice';
import { updateUser } from './user';
import _saveToken, { usePromo as _usePromo } from '../../components/StripeModal/api';
import { getPlans } from '../../containers/Subscription/api'
import { getPlansAccount } from '../../containers/Account/api'
// ------------------------------------
// Constants
// ------------------------------------
export const START_FETCHING_PLANS = 'START_FETCHING_PLANS' // Subscription page
export const END_FETCHING_PLANS = 'END_FETCHING_PLANS' // Subscription page
export const ERROR_FETCHING_PLANS = 'ERROR_FETCHING_PLANS' // Subscription page
export const SELECT_PLAN = 'SELECT_PLAN' // Subscription page
export const ERROR_SUBSCIPTION = 'ERROR_SUBSCIPTION'
export const SAVE_TOKEN_START = 'SAVE_TOKEN_START'
export const SAVE_TOKEN_END = 'SAVE_TOKEN_END'
export const START_FETCHING_PLANS_ACCOUNT = 'START_FETCHING_PLANS_ACCOUNT'
export const END_FETCHING_PLANS_ACCOUNT = 'END_FETCHING_PLANS_ACCOUNT' // Account Setting page
export const ERROR_FETCHING_PLANS_ACCOUNT = 'ERROR_FETCHING_PLANS_ACCOUNT' // Account Setting page
export const ENROLL_PLAN = 'ENROLL_PLAN' // Account Setting page
export const USE_PROMO_START = 'USE_PROMO_START';
export const USE_PROMO_END = 'USE_PROMO_END';
export const PRE_SUBSCRIBE_PLAN = 'PRE_SUBSCRIBE_PLAN';
// ------------------------------------
// helper
// ------------------------------------
function getDefaultSelectedPlan(plans) {
  const planIndex = _.findIndex(plans, ['recommended', true])
  if (planIndex !== -1) {
    return plans[planIndex]
  }
}

function getDefaultEnrolledPlan(plans) {
  const planIndex = _.findIndex(plans, ['currentPlan', true])
  if (planIndex !== -1) {
    return plans[planIndex]
  }
}
// ------------------------------------
// Actions
// ------------------------------------

// Subscription page get Plans action
export function selectPlan(plan) {
  return (dispatch) => {
    dispatch({ type: SELECT_PLAN, payload: plan })
  }
}

export function fetchPlansDetails() {
  return (dispatch) => {
    dispatch({ type: START_FETCHING_PLANS })
    // api call
    getPlans()
      .then((res) => {
        const plan = getDefaultSelectedPlan(res && res.body && res.body.plans)
        dispatch(selectPlan(plan))
        dispatch({ type: END_FETCHING_PLANS, payload: res && res.body })
      })
      .catch((error) => {
        console.error(error)
        dispatch(notify({ error }))
        dispatch({ type: ERROR_FETCHING_PLANS })
      })
  }
}

export function getPlansDetails() {
  return (dispatch, getState) => {
    const details = getState().subscription
    const { plans } = details
    if (_.isEmpty(plans.info)) {
      dispatch(fetchPlansDetails())
    } else {
      dispatch({ type: END_FETCHING_PLANS, payload: plans.info })
    }
  }
}

// Accounts Plan page get Plans actions
export function enrollPlan(plan) {
  return (dispatch) => {
    dispatch({ type: ENROLL_PLAN, payload: plan })
  }
}

export function fetchPlansDetailsAccount() {
  return (dispatch) => {
    dispatch({ type: START_FETCHING_PLANS_ACCOUNT })
    getPlansAccount()
      .then((res) => {
        const plan = getDefaultEnrolledPlan(res && res.body && res.body.plans)
        dispatch(enrollPlan(plan))
        dispatch({ type: END_FETCHING_PLANS_ACCOUNT, payload: res && res.body })
      })
      .catch((error) => {
        console.error(error)
        dispatch(notify({ error }))
        dispatch({ type: ERROR_FETCHING_PLANS_ACCOUNT })
      })
  }
}

export function getPlansDetailsAccount() {
  return (dispatch, getState) => {
    const details = getState().subscription
    const { plansAccount } = details
    if (_.isEmpty(plansAccount.info)) {
      dispatch(fetchPlansDetailsAccount())
    } else {
      dispatch({ type: END_FETCHING_PLANS_ACCOUNT, payload: plansAccount.info })
    }
  }
}

export function presubscribePlan(planID) {
  return (dispatch) => {
    dispatch({ type: PRE_SUBSCRIBE_PLAN, payload: planID })
  }
}

// stripe token specific actions
export function saveToken(payload, done) {
  return (dispatch, getState) => {
    dispatch({ type: SAVE_TOKEN_START });
    _saveToken(payload)
      .then((res) => {
        const { user: { info } } = getState();
        const subscriptions = _.orderBy(res.body.subscriptions, o => new Date(o.startDate), 'desc');
        const nextPlan = subscriptions[0] || {};
        // update payload of user
        if (info.subscriptions && subscriptions) {
          info.subscriptions = subscriptions;
          if (!_.isEmpty(subscriptions)) {
            info.wasSubscriber = true;
            info.lastFour = nextPlan.lastFour;
          }
          if (nextPlan.checkoutURL)
            dispatch(notify({ message: 'Please check your email for your free Muse.' }));
        }
        // update user into store
        dispatch(updateUser(info));
        // mark new plan as upcoming in store
        dispatch(presubscribePlan(nextPlan.planID))
        dispatch({ type: SAVE_TOKEN_END });
        done(false, payload);
      })
      .catch((error) => {
        console.error(error)
        done(true)
        dispatch(notify({ error }))
      })
  }
}

// promo specific action
export function usePromo(promoID, done = () => { }) {
  return (dispatch) => {
    dispatch({ type: USE_PROMO_START });

    _usePromo(promoID)
      .end((error, res) => {
        if (error) {
          dispatch(notify({ error }));
        }

        dispatch({ type: USE_PROMO_END });
        done(error, res && res.body && res.body.promo && res.body.promo.promoURL);
      });
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const plansInitialState = {
  isFetching: false,
  isError: false,
  selectedPlan: {},
  info: {},
}
const tokenInitialState = {
  isFetching: false,
  isError: false,
}

const plansAccountInitialState = {
  isFetching: false,
  isError: false,
  info: {
  },
  enrolledPlan: {
  }
}

const initialState = {
  plans: plansInitialState, // Subscription Page
  token: tokenInitialState,
  plansAccount: plansAccountInitialState
};

const ACTION_HANDLERS = {
  // subscription page reducers
  [START_FETCHING_PLANS]: state => ({
    ...state,
    plans: {
      ...plansInitialState,
      isFetching: true
    }
  }),
  [END_FETCHING_PLANS]: (state, action) => ({
    ...state,
    plans: {
      ...state.plans,
      info: action.payload,
      isFetching: false
    }
  }),
  [SELECT_PLAN]: (state, action) => ({
    ...state,
    plans: {
      ...state.plans,
      selectedPlan: action.payload
    }
  }),
  [ERROR_FETCHING_PLANS]: state => ({
    ...state,
    plans: {
      ...plansInitialState,
      isError: true,
      isFetching: false
    }
  }),
  // Account (Plan) reducers
  [START_FETCHING_PLANS_ACCOUNT]: state => ({
    ...state,
    plansAccount: {
      ...plansAccountInitialState,
      isFetching: true
    }
  }),
  END_FETCHING_PLANS_ACCOUNT: (state, action) => ({
    ...state,
    plansAccount: {
      ...state.plansAccount,
      info: action.payload,
      isFetching: false
    }
  }),
  ERROR_FETCHING_PLANS_ACCOUNT: state => ({
    ...state,
    plansAccount: {
      ...plansAccountInitialState,
      isError: true,
      isFetching: false
    }
  }),
  ENROLL_PLAN: (state, action) => ({
    ...state,
    plansAccount: {
      ...state.plansAccount,
      enrolledPlan: action.payload
    }
  }),
  // stripe token reducers
  [SAVE_TOKEN_START]: state => ({
    ...state,
    token: {
      ...tokenInitialState,
      isFetching: true
    }
  }),
  [SAVE_TOKEN_END]: state => ({
    ...state,
    token: {
      ...tokenInitialState
    }
  }),
  [PRE_SUBSCRIBE_PLAN]: (_state, { payload: planID }) => {
    const state = { ..._state }
    if (planID && state.plansAccount.info.plans) {
      state.plansAccount.info.plans = _.map(
        state.plansAccount.info.plans,
        o => ({ ...o, upcomingPlan: o.planID === planID })
      )
    }
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function subscriptionReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

