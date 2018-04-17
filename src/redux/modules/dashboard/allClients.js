// Imports
import _ from 'lodash'
import getAllClientSessionsApi from '../../../containers/Dashboard/api';
import calculateAggregateData from '../../../libs/helpers/activeClients';
import { notify } from '../notice';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ALL_CLIENT_SESSIONS_START = 'GET_ALL_CLIENT_SESSIONS_START';
export const GET_ALL_CLIENT_SESSIONS_END = 'GET_ALL_CLIENT_SESSIONS_END';
export const ALL_CLIENT_ERROR = 'ALL_CLIENT_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchAllClientSessions() {
  return (dispatch) => {
    dispatch({ type: GET_ALL_CLIENT_SESSIONS_START })
    getAllClientSessionsApi()
      .then((res) => {
        res.body.client_activity = _.map(res.body.client_activity, (o) => {
          const date = new Date(o.date);

          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          return { ...o, date: date.toISOString() };
        });
        calculateAggregateData(
          res.body.client_activity,
          new Date(),
          new Date(),
          true,
          ({ aggregateDays }) => {
            dispatch({
              type: GET_ALL_CLIENT_SESSIONS_END,
              payload: { ...res.body, aggregateDays }
            })
          },
          true);
      })
      .catch((error) => {
        console.error(error);
        dispatch(notify({ error }))
        dispatch({ type: ALL_CLIENT_ERROR })
      })
  }
}

export function getAllClientSessions() {
  return (dispatch, getState) => {
    const { allClients } = getState()
    if (_.isEmpty(allClients.info)) {
      dispatch(fetchAllClientSessions())
    } else {
      dispatch({ type: GET_ALL_CLIENT_SESSIONS_END, payload: allClients.info })
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
export const initialState = {
  isFetching: false,
  isError: false,
  info: {}
}

const ACTION_HANDLERS = {
  [ALL_CLIENT_ERROR]: () =>
    ({ ...initialState, isError: true }),
  [GET_ALL_CLIENT_SESSIONS_START]: state => ({ ...state, isFetching: true }),
  [GET_ALL_CLIENT_SESSIONS_END]: (state, action) =>
    ({ ...state, info: action.payload, isFetching: false }),
}
// ------------------------------------
// Reducer
// ------------------------------------
export default function allClientsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
