// Imports
import _ from 'lodash'
import { browserHistory } from 'react-router';
import {
  getAggregateSessions as _getAggregateSessions,
  getDailySessionsApi
} from '../../containers/Client/api';
import endPoints from '../../routes/endPoints';
import calculateAggregateData from '../../libs/helpers/activeClients';
import {
  fetchClientsList as _fetchClientsList
} from '../../redux/modules/clientList';
import { notify } from './notice';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_CLIENT_START = 'GET_CLIENT_START';
export const GET_CLIENT_END = 'GET_CLIENT_END';
export const GET_AGGREGATE_SESSIONS_START = 'GET_AGGREGATE_SESSIONS_START';
export const GET_AGGREGATE_SESSIONS_END = 'GET_AGGREGATE_SESSIONS_END';
export const GET_DAILY_SESSION_START = 'GET_DAILY_SESSION_START';
export const GET_DAILY_SESSION_END = 'GET_DAILY_SESSION_END';
export const DAILY_SESSION_ERROR = 'DAILY_SESSION_ERROR';
export const SET_CURRENT_CLIENT_ID = 'SET_CURRENT_CLIENT_ID';
export const RESET_DAILY_SESSIONS = 'RESET_DAILY_SESSIONS'
export const CLIENT_ERROR = 'CLIENT_ERROR';

/**
 * Calculates Past 30 days card values, and aggregate graph values
 * @param {Object} param0 Raw aggregate sessions API response
 * @param {Function} done Callback with calculated values
 * @return {Null} null
 */
function fixAggregateSessions({ aggregateSessions }, done) {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const end = new Date();

  calculateAggregateData(
    aggregateSessions,
    start,
    end,
    false,
    ({ aggregateDays, activeDays: active_days }) => {
      let total_mins = 0
      _.forEach(aggregateDays, (dayData, _date) => {
        if (new Date(_date) >= start) {
          // One day may have more than one session
          let seconds_calm, seconds_neutral, seconds_active;
          _.forEach(dayData, ({ seconds_calm, seconds_neutral, seconds_active }) => {
            total_mins += seconds_calm + seconds_neutral + seconds_active;
          })
        }
      });

      total_mins /= 60;

      const avg_mins_per_active_day = total_mins / (active_days || 1);
      const avg_active_days_per_week = Math.round((active_days / 4) * 100) / 100;

      done({
        aggregateSessions,
        aggregateDays,
        active_days,
        avg_mins_per_active_day: Math.round(avg_mins_per_active_day * 100) / 100,
        avg_active_days_per_week: Math.round(avg_active_days_per_week * 100) / 100,
        total_mins: Math.floor(total_mins)
      });
    },
    true
  );
}

// ------------------------------------
// Actions
// ------------------------------------

/*
 * @function getClient
 * @param {string} clientId
 * @returns promise to resolve client details
 */
export function getClient(clientId) {
  return (dispatch, getState) => {
    const prevClients = getState().clientList.clients.info.active_clients;
    const prevClientIndex = _.findIndex(
      prevClients, client => client.id.toString() === clientId
    );
    dispatch({ type: GET_CLIENT_START })

    if (prevClientIndex > -1)
      return setTimeout(() => dispatch({ type: GET_CLIENT_END, payload: prevClients[prevClientIndex] }), 0)

    dispatch(_fetchClientsList())
      .then(() => {
        const _prevClients = getState().clientList.clients.info.active_clients;
        const _prevClientIndex = _.findIndex(
          _prevClients, client => client.id.toString() === clientId
        );
        if (_prevClientIndex > -1)
          return dispatch({ type: GET_CLIENT_END, payload: _prevClients[_prevClientIndex] });
        // To_Do: Redirect to 404 page instead of clients list page
        browserHistory.replace(endPoints.clients);
      })
      .catch(() => {
        dispatch({ type: CLIENT_ERROR });
        dispatch(notify());
      })
  }
}

export function getAggregateSessions(clientId) {
  return (dispatch) => {
    dispatch({ type: GET_AGGREGATE_SESSIONS_START });
    _getAggregateSessions(clientId)
      .then((res) => {
        fixAggregateSessions(res.body, payload => dispatch({
          type: GET_AGGREGATE_SESSIONS_END,
          payload
        }));
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: CLIENT_ERROR, payload: (error.response && error.response.body.error) ? error.response.body.error.message : undefined });
        dispatch(notify({ error }));
      })
  }
}

// sets the current client id to daily session
export function setClientIdDailySession(id) {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_CLIENT_ID, payload: id })
  }
}

export function fetchDailySessions(clientId, pageSize) {
  return (dispatch, getState) => {
    const client = getState().client
    const { info: dailySessions } = (client && client.dailySessions) || {}
    const nextURL = dailySessions && dailySessions.nextURL

    if (nextURL !== null) {
      dispatch({ type: GET_DAILY_SESSION_START })
      getDailySessionsApi(clientId, nextURL, pageSize)
        .then((res) => {
          dispatch({ type: GET_DAILY_SESSION_END, payload: res && res.body })
        })
        .catch((error) => {
          console.error(error);
          dispatch(notify({ error }))
          dispatch({ type: DAILY_SESSION_ERROR })
        })
    }
  }
}

export function resetDailySessions(clientId) {
  return (dispatch, getState) => {
    const client = getState().client
    const { currentClientId } = (client && client.dailySessions) || {}
    if (currentClientId !== clientId) {
      // page is not same as previous one then reset dailySessions
      dispatch({ type: RESET_DAILY_SESSIONS })
      dispatch(setClientIdDailySession(clientId)) // set current user id
    }
  }
}
/*
 * @export getDailySessions checks if the same client profile page is opened again(in succession)
 *  then displays the previous already loaded session.Loads more when scroll to bottom
 * @param {string} clientId stores the current client id
 * @param {number} [skip=0] used to check if needs to call for more session
 * @param {number} [pageSize=10]
 */
export function getDailySessions(clientId, skip = 0, pageSize = 10) {
  return (dispatch, getState) => {
    const client = getState().client
    const { info: dailySessions } = (client && client.dailySessions) || {}
    // i.e same page is opened again, displays the previously loaded sessions
    if (skip < (dailySessions && dailySessions.sessions && dailySessions.sessions.length)) {
      dispatch({ type: GET_DAILY_SESSION_END, payload: { ...dailySessions, sessions: [] } })
    } else {
      // make action call which fetches sessions from api
      dispatch(fetchDailySessions(clientId, pageSize))
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialClient = {
  isFetching: true,
  info: {}
}
const initialAggregateSessions = {
  isFetching: false,
  info: {
    aggregateSessions: []
  }
}
const initialDailySession = {
  isFetching: false,
  info: {
    sessions: []
  },
  isError: false,
  currentClientId: null,
}

const initialState = {
  client: initialClient,
  aggregateSessions: initialAggregateSessions,
  dailySessions: initialDailySession,
  isError: false
}

const ACTION_HANDLERS = {
  [GET_CLIENT_START]: state => ({ ...state, client: { ...initialClient, isFetching: true } }),
  [GET_CLIENT_END]: (state, { payload }) => ({
    ...state,
    client: {
      ...initialClient,
      ...(payload && { info: payload }),
      isFetching: false
    }
  }),
  [CLIENT_ERROR]: (state, { payload }) => ({
    ...state,
    isError: true,
    errorText: payload
  }),
  [GET_AGGREGATE_SESSIONS_START]: state => ({
    ...state,
    aggregateSessions: {
      ...initialAggregateSessions,
      isFetching: true
    }
  }),
  [GET_AGGREGATE_SESSIONS_END]: (state, { payload }) => ({
    ...state,
    aggregateSessions: {
      ...initialAggregateSessions,
      ...(payload && { info: payload })
    }
  }),
  [GET_DAILY_SESSION_START]: state => ({
    ...state,
    dailySessions: {
      ...state.dailySessions,
      isFetching: true,
      isError: false
    }
  }),
  [GET_DAILY_SESSION_END]: (state, action) => {
    const info = action.payload || {}
    const sessions = info.sessions ? info.sessions : []
    info.sessions = [...state.dailySessions.info.sessions, ...sessions]
    return ({
      ...state,
      dailySessions: {
        ...state.dailySessions,
        info,
        isFetching: false
      }
    })
  },
  [DAILY_SESSION_ERROR]: state => ({
    ...state,
    dailySessions: {
      ...state.dailySessions,
      isError: true,
      isFetching: false
    }
  }),
  [RESET_DAILY_SESSIONS]: state => ({
    ...state,
    dailySessions: initialDailySession
  }),
  [SET_CURRENT_CLIENT_ID]: (state, action) => ({
    ...state,
    dailySessions: {
      ...state.dailySessions,
      currentClientId: action.payload
    }
  })
}
// ------------------------------------
// Reducer
// ------------------------------------
export default function clientList(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
