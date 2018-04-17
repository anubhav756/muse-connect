// Imports
import _ from 'lodash';
import {
  getClients,
  resendInvitation as _resendInvitation,
  cancelInvitation as _cancelInvitation,
  archiveUnarchive as _archiveUnarchive
} from '../../containers/ClientList/api'
import { getCurrentDay, areInSameDay, commafy } from '../../libs/helpers/common';
import _addClient from '../../components/AddClient/api';
import { cleverTapSendInvite, cleverTapResendInvite, cleverTapCancelInvite, cleverTapArchiveClient } from '../../libs/cleverTap'
import { notify } from './notice'
import { applyClientAction, applyStatusFilter, applySort, CLIENT_NAME, ALL, ACCEPTED, ARCHIVED, DENIED } from '../../libs/helpers/clientList'
import {
  getInvitedNonMusers,
  resendInviteNonMuser,
  cancelInviteNonMuser,
  addNonMuserInvites
} from './nonMuserInvites'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_STATUS_FILTER = 'SET_STATUS_FILTER'
export const SET_LIST_SORT = 'SET_LIST_SORT'
export const FETCH_CLIENTS_START = 'FETCH_CLIENTS_START'
export const FETCH_CLIENTS_ERROR = 'FETCH_CLIENTS_ERROR'
export const FETCH_CLIENTS_END = 'FETCH_CLIENTS_END'
export const ADD_CLIENT_START = 'ADD_CLIENT_START';
export const ADD_CLIENT_END = 'ADD_CLIENT_END';
export const UPDATE_DISPLAY_LIST = 'UPDATE_DISPLAY_LIST'
export const CLIENT_ACTION = 'CLIENT_ACTION'
export const RESEND_INVITATION_START = 'RESEND_INVITATION_START'
export const RESEND_INVITATION_END = 'RESEND_INVITATION_END'
export const CANCEL_INVITATION_START = 'CANCEL_INVITATION_START'
export const CANCEL_INVITATION_END = 'CANCEL_INVITATION_END'
export const ARCHIVE_UNARCHIVE_START = 'ARCHIVE_UNARCHIVE_START'
export const ARCHIVE_UNARCHIVE_END = 'ARCHIVE_UNARCHIVE_END'
export const CLEAN_CLIENT_LIST = 'CLEAN_CLIENT_LIST'
export const FIX_AND_MERGE_NON_MUSERS = 'FIX_AND_MERGE_NON_MUSERS'

// ------------------------------------
// Helper methods
// ------------------------------------

/**
 * Helper that wraps cancelInviteNonMuser action creator with a callback into a promise
 * @param {string} id id of the non muser to cancel invitation to
 * @param {function} dispatch method to dispatch actions to redux store
 * @returns {promise} promise for cancel invite
 */
function cancelInviteNonMuserPromise(id, dispatch) {
  return new Promise((resolve, reject) => dispatch(
    cancelInviteNonMuser(id, err => (err ? reject(err) : resolve())))
  )
}

/**
 * Helper that wraps resendInviteNonMuser action creator with a callback into a promise
 * @param {string} id id of the non muser to resend invitation to
 * @param {function} dispatch method to dispatch actions to redux store
 * @returns {promise} promise for resend invite
 */
function resendInviteNonMuserPromise(id, dispatch) {
  return new Promise((resolve, reject) => dispatch(
    resendInviteNonMuser(id, err => (err ? reject(err) : resolve())))
  )
}

/**
 * Updates some of the keys of all the non muser clients for use in the app
 * @param {array} nonMusers List of all non muser invites
 * @returns {array} List of all non musers with keys fixed
 */
function fixNonMuserList(nonMusers) {
  return _.map(
    nonMusers,
    client => ({
      id: client.id,
      email: client.email,
      date: client.createDate,
      status: 'INVITED',
      nonMuser: true
    })
  )
}

/**
 * Wrapper that converts callback response from getInvitedNonMusers
 * action creator into a promise for use inside promise.all()
 * @param {function} dispatch dispatches an action to store
 * @returns {promise} promise that resolves when getInvitedNonMusers callback fires
 */
function getNonMuserClientsPromise(dispatch) {
  return new Promise((resolve, reject) => dispatch(
    getInvitedNonMusers(err => (err ? reject(err) : resolve())))
  )
}

/**
 * Gets the __clientAction key from clients' displayList in store
 * of the client with the given id
 * @param {object} state redux store state
 * @param {string} id id of the required client
 * @returns {string} the given client's __clientAction value
 */
function getClientAction(state, id) {
  const list = state.clientList.displayList;
  const index = list.findIndex(({ id: _id }) => id === _id)
  return index === -1 ? null : list[index].__clientAction;
}

/**
 * helper method to fix the clients API response before feeding to store
 * IMPORTANT: This method changes some of the actual keys of the API response
 * @param {Object} data API data to be fixed
 * @return {Object} fixed API data
 */
function fixApiResponse(data) {
  const fixedData = { ...data };
  const last_7_days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = getCurrentDay();
    date.setDate(date.getDate() - i);
    last_7_days.push(date.toISOString());
  }

  // mark active_clients with a "status" key.
  fixedData.active_clients = _.map(fixedData.active_clients, (_o) => {
    const o = { ..._o };

    // rename "user_id" to "id"
    o.id = o.user_id;
    delete o.user_id;

    // calculate session_days, sessions_number, session_minutes_total, session_minutes_avg
    const session_days = _.reduce(last_7_days, (result, _date) => ({
      ...result,
      [_date]: _.findIndex(o.sessions_last_week, ({ date }) =>
        areInSameDay(date, _date)) !== -1
    }), {});
    const sessions_number = _.reduce(session_days, (result, session_day) =>
      result + session_day, 0);
    const session_minutes_total = (_.reduce(o.sessions_last_week, (result, { length }) =>
      result + length, 0)) / 60;
    const session_minutes_avg = session_minutes_total / (sessions_number || 1);

    return {
      ...o,
      status: ACCEPTED,
      session_days,
      sessions_number,
      session_minutes_total: Math.floor(session_minutes_total),
      session_minutes_avg: Math.floor(session_minutes_avg)
    };
  });

  // rename archived_clients "user_id" to "id"
  fixedData.archived_clients = _.map(fixedData.archived_clients, (_o) => {
    const o = { ..._o };

    o.id = o.user_id;
    delete o.user_id;

    return o;
  });

  fixedData.other_clients = _.map(fixedData.other_clients, (_o) => {
    const o = { ..._o };

    // rename other_clients "user_id" to "id"
    o.id = o.user_id;
    delete o.user_id;

    // rename "date" as "declined_date" in DENIED clients
    if (o.status === DENIED) {
      o.declined_date = o.date;
      delete o.date;
    }

    return o;
  });

  // Rename {string} "total_clients" to {number} "clients_count"
  fixedData.clients_count = parseInt(fixedData.total_clients, 10);
  delete fixedData.total_clients;

  return fixedData;
}

function cleanClientList(state) {
  let clients_count = state.clients.info.clients_count;
  if (!clients_count && clients_count !== 0)
    return state;

  const active_clients = [];
  const archived_clients = [];
  const other_clients = [];

  if (state.clients.info.active_clients)
    state.clients.info.active_clients.forEach(({ __clientAction, ...other }) => {
      if (__clientAction !== CANCEL_INVITATION_END)
        active_clients.push(other);
      else clients_count -= 1
    })
  if (state.clients.info.archived_clients)
    state.clients.info.archived_clients.forEach(({ __clientAction, ...other }) => {
      if (__clientAction !== CANCEL_INVITATION_END)
        archived_clients.push(other);
      else clients_count -= 1
    })
  if (state.clients.info.other_clients)
    state.clients.info.other_clients.forEach(({ __clientAction, ...other }) => {
      if (__clientAction !== CANCEL_INVITATION_END)
        other_clients.push(other);
      else clients_count -= 1
    })
  return {
    ...state,
    clients: {
      ...state.clients,
      info: {
        ...state.clients.info,
        active_clients,
        archived_clients,
        other_clients,
        clients_count
      }
    }
  }
}
function clientActionHandler(state, { payload: { id, clientAction, unarchive } }) {
  let { active_clients, archived_clients, other_clients } = state.clients.info;

  if (clientAction === ARCHIVE_UNARCHIVE_START) {
    const { input } = applyClientAction({
      id,
      clientAction,
      input: unarchive ? archived_clients : active_clients
    })
    if (unarchive) archived_clients = input
    else active_clients = input
  } else if (clientAction === ARCHIVE_UNARCHIVE_END) {
    const { input, output } = applyClientAction({
      id,
      clientAction: null,
      input: unarchive ? archived_clients : active_clients,
      output: unarchive ? active_clients : archived_clients,
      status: unarchive ? ACCEPTED : ARCHIVED
    })
    active_clients = unarchive ? output : input
    archived_clients = unarchive ? input : output
  } else if (clientAction === CANCEL_INVITATION_END) {
    const { input } = applyClientAction({
      id,
      input: other_clients,
      output: []
    })
    other_clients = input
  } else {
    const { input } = applyClientAction({
      id,
      clientAction,
      input: other_clients
    })
    other_clients = input
  }

  return ({
    ...state,
    clients: {
      ...state.clients,
      info: {
        ...state.clients.info,
        active_clients,
        archived_clients,
        other_clients
      }
    }
  });
}

// ------------------------------------
// Actions
// ------------------------------------

/*
 * @function applyFiltersAndSort
 * @param {object} [clientListState={}]
 * @returns filtered and sorted list
 */
export function applyFiltersAndSort(clientListState = {}) {
  let filteredList = clientListState.clientListInfo
  filteredList = applyStatusFilter(filteredList, clientListState.statusFilter)
  filteredList = applySort(filteredList, clientListState.sortByColumn, clientListState.reverse)
  return filteredList
}
/*
 * @function fetchClientsList
 *  gets client list from api and sets into store.
 */
export function fetchClientsList(forceUpdate) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_CLIENTS_START, payload: forceUpdate })

    // Fetch all clients as well as fire getNonMuserClientsPromise concurrently.
    // Once the getNonMuserClientsPromise resolves, all the non musers are merged into
    // the all clients list, after being marked with a "nonMuser" key.
    return Promise.all([
      getClients(),
      getNonMuserClientsPromise(dispatch)
    ])
      .then(([res]) => {
        const clientsInfo = res && res.body && fixApiResponse(res.body);
        const {
          clientList: {
            statusFilter,
          lastActiveFilter,
          sortByColumn,
          reverse
          },
          nonMuserInvites
        } = getState()
        const nonMuserClients = nonMuserInvites &&
          nonMuserInvites.clonedList &&
          nonMuserInvites.clonedList.invites

        dispatch({ type: FETCH_CLIENTS_END, payload: clientsInfo })

        // Merge other_clients with invited non-muser clients
        dispatch({
          type: FIX_AND_MERGE_NON_MUSERS,
          payload: nonMuserClients
        })

        const clients = applyFiltersAndSort({
          clientListInfo: getState().clientList.clients.info,
          statusFilter,
          lastActiveFilter,
          sortByColumn,
          reverse
        })
        dispatch({ type: UPDATE_DISPLAY_LIST, payload: clients })
      })
      .catch((error) => {
        dispatch({ type: FETCH_CLIENTS_ERROR })
        dispatch(notify({ error }))
      })
  }
}
/*
 * @function getClientsList
 *  checks if all the clients have loaded then it applies local filtering and sorting according
 *  to sets filters and sort and updates display list thus saves api call otherwise fetches
 *  from api.
 */
export function getClientsList(clean, forceUpdate) {
  return (dispatch, getState) => {
    if (clean)
      dispatch({ type: CLEAN_CLIENT_LIST });
    const clientListState = getState().clientList
    const clientListInfo = clientListState.clients && clientListState.clients.info
    const statusFilter = clientListState.statusFilter
    const lastActiveFilter = clientListState.lastActiveFilter
    const sortByColumn = clientListState.sortByColumn
    const reverse = clientListState.reverse

    if (!forceUpdate && (clientListInfo.clients_count || clientListInfo.clients_count === 0)) {
      // If the all clients list is not empty, it is safe to assume that
      // all the non-musers have been fetched, and therefore skip checking that
      const clients = applyFiltersAndSort(
        { clientListInfo, statusFilter, lastActiveFilter, sortByColumn, reverse }
      )
      return dispatch({ type: UPDATE_DISPLAY_LIST, payload: clients })
    }
    if (!clientListState.clients.isFetching)
      dispatch(fetchClientsList(forceUpdate))
  }
}

export function applyBulkAction() {
  // logic to be added
}

/*
 * @function setStatusFilter sets the statusFilter into store and calls to get client list
 * @export
 * @param {string} value
 */
export function setStatusFilter(value) {
  return (dispatch) => {
    dispatch({ type: SET_STATUS_FILTER, payload: value })
    dispatch(getClientsList())
  }
}
/*
 * @function setSortByColumn sets the sort column into store and calls to get client list
 * @export
 * @param {string} value
 */
export function setSortByColumn(value) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_LIST_SORT,
      payload: {
        value,
        reverse: getState().clientList.sortByColumn === value && !getState().clientList.reverse
      },
    })
    dispatch(getClientsList())
  }
}

/*
 * @function addClient calls API to add a new client
 * @export
 * @param {string} emailString
 */
export function addClient(emailString, done = () => { }) {
  return (dispatch) => {
    dispatch({ type: ADD_CLIENT_START });
    const emails = emailString.split(',').map(e => e.trim());

    _addClient({ emails })
      .then((res) => {
        const {
          clientsAdded,
          clientsExisted,
          invitesAdded,
          invitesExisted,
          failed
        } = res.body;
        const notifyMsgs = [];
        const totalAdded = [];
        const totalExisted = [];

        if (!_.isEmpty(clientsAdded) && _.isArray(clientsAdded)) {
          totalAdded.push(...clientsAdded);
        }
        if (!_.isEmpty(invitesAdded) && _.isArray(invitesAdded)) {
          totalAdded.push(...invitesAdded);
        }

        if (!_.isEmpty(clientsExisted) && _.isArray(clientsExisted)) {
          totalExisted.push(...clientsExisted);
        }
        if (!_.isEmpty(invitesExisted) && _.isArray(invitesExisted)) {
          totalExisted.push(...invitesExisted);
        }

        if (!_.isEmpty(totalAdded)) {
          const mails = commafy(_.map(totalAdded, (o) => {
            cleverTapSendInvite(); // clever tap event
            return `<b>${o.email}</b>`;
          }))
          const message = totalAdded.length === 1 ?
            `Invitation was sent to ${mails} successfully.` :
            `Invitations were sent to ${mails} successfully.`;

          notifyMsgs.push(message);
        }
        if (!_.isEmpty(totalExisted) && _.isArray(totalExisted)) {
          const mails = commafy(_.map(totalExisted, o => `<b>${o}</b>`))
          const message = totalExisted.length === 1 ?
            `Invitation was not sent to ${mails} because he/she is already invited.` :
            `Invitations were not sent to ${mails} because they are already invited.`;

          notifyMsgs.push(message);
        }
        if (!_.isEmpty(failed) && _.isArray(failed)) {
          const mails = commafy(_.map(failed, o => `<b>${o}</b>`))
          const message = failed.length === 1 ?
            `Invitation was not sent to ${mails}.Please try again.` :
            `Invitations were not sent to ${mails}. Please try again.`;

          notifyMsgs.push(message);
        }
        dispatch({
          type: ADD_CLIENT_END,
          payload: clientsAdded.map(({ user_id, ...others }) => ({
            id: user_id,
            ...others
          }))
        });

        // updated nonMuserInvites key at redux store with latest non muser invites
        dispatch(addNonMuserInvites(invitesAdded))

        // fix and merge non muser invites to all clients display list
        dispatch({
          type: FIX_AND_MERGE_NON_MUSERS,
          payload: invitesAdded
        })

        dispatch(notify({ message: _.reduce(notifyMsgs, (result, next) => `${result}<br><br>${next}`) }))
        dispatch(getClientsList());
        done(null, res);
      })
      .catch((error) => {
        console.error(error);
        done(true);
        dispatch(notify({ error }));
        dispatch({ type: ADD_CLIENT_END });
      })
  }
}

/*
 * @function resendInvitation calls API to resend a client invitation
 * @export
 * @param {string} id, {function} done
 */
export function resendInvitation(id, nonMuser, done = () => { }) {
  return (dispatch, getState) => {
    const prevClientAction = getClientAction(getState(), id);

    dispatch({
      type: CLIENT_ACTION,
      payload: {
        id,
        clientAction: RESEND_INVITATION_START
      }
    });

    const resendInvitePromise = nonMuser ?
      resendInviteNonMuserPromise(id, dispatch) :
      _resendInvitation(id)

    resendInvitePromise
      .then((res) => {
        cleverTapResendInvite() // clever tap event
        dispatch({
          type: CLIENT_ACTION,
          payload: {
            id,
            clientAction: RESEND_INVITATION_END
          }
        })
        dispatch(notify({ message: 'Invitation has been re-sent' }))
        dispatch(getClientsList())
        done(null, res);
      })
      .catch((error) => {
        dispatch({
          type: CLIENT_ACTION,
          payload: {
            id,
            clientAction: prevClientAction
          }
        });
        dispatch(notify({ error }));
        done(error);
      })
  }
}

/*
 * @function cancelInvitation calls API to cancel a client invitation
 * @export
 * @param {string} id, {function} done
 */
export function cancelInvitation(id, nonMuser, done = () => { }) {
  return (dispatch, getState) => {
    const prevClientAction = getClientAction(getState(), id);

    dispatch({
      type: CLIENT_ACTION,
      payload: {
        id,
        clientAction: CANCEL_INVITATION_START
      }
    });

    const cancelInvitePromise = nonMuser ?
      cancelInviteNonMuserPromise(id, dispatch) :
      _cancelInvitation(id)

    cancelInvitePromise
      .then((res) => {
        cleverTapCancelInvite() // clever tap event
        dispatch({
          type: CLIENT_ACTION,
          payload: {
            id,
            clientAction: CANCEL_INVITATION_END
          }
        })
        dispatch(notify({ message: 'Invitation has been cancelled' }))
        dispatch(getClientsList())
        done(null, res);
      })
      .catch((error) => {
        dispatch({
          type: CLIENT_ACTION,
          payload: {
            id,
            clientAction: prevClientAction
          }
        });
        dispatch(notify({ error }));
        done(error);
      })
  }
}

/*
 * @function archiveUnarchive calls API to archive/unarchive client
 * @export
 * @param {string} id, {bool} unarchive, {function} done
 */
export function archiveUnarchive(id, unarchive, done = () => { }) {
  return (dispatch, getState) => {
    const prevClientAction = getClientAction(getState(), id);

    dispatch({
      type: CLIENT_ACTION,
      payload: {
        id,
        unarchive,
        clientAction: ARCHIVE_UNARCHIVE_START
      }
    });
    _archiveUnarchive(id, unarchive)
      .then((res) => {
        cleverTapArchiveClient() // clever tap event
        if (!unarchive)
          dispatch({
            type: CLIENT_ACTION,
            payload: {
              id,
              unarchive,
              clientAction: ARCHIVE_UNARCHIVE_END
            }
          })
        dispatch(getClientsList(false, unarchive))
        done(null, res);
      })
      .catch((error) => {
        dispatch({
          type: CLIENT_ACTION,
          payload: {
            id,
            unarchive,
            clientAction: prevClientAction
          }
        });
        dispatch(notify({ error }));
        done(error);
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const clientsInitialState = {
  isFetching: false,
  isError: false,
  info: {}
}
export const initialState = {
  statusFilter: ALL,
  sortByColumn: CLIENT_NAME,
  reverse: false,
  clients: clientsInitialState,
  displayList: [],
  addingClient: false
}

const ACTION_HANDLERS = {
  [SET_STATUS_FILTER]: (state, action) => ({ ...state, statusFilter: action.payload }),
  [SET_LIST_SORT]: (state, action) => ({
    ...state,
    sortByColumn: action.payload.value,
    reverse: action.payload.reverse
  }),
  [UPDATE_DISPLAY_LIST]: (state, action) => ({ ...state, displayList: action.payload }),
  [FETCH_CLIENTS_START]: (state, { payload: forceUpdate }) => (
    {
      ...state,
      clients: {
        ...(forceUpdate ? state.clients : clientsInitialState),
        isFetching: !forceUpdate
      }
    }
  ),
  [FETCH_CLIENTS_END]: (state, action) => (
    { ...state, clients: { ...clientsInitialState, info: action.payload } }
  ),
  [FETCH_CLIENTS_ERROR]: state => ({
    ...state,
    clients: {
      ...clientsInitialState,
      isError: true
    }
  }),
  [ADD_CLIENT_START]: state => ({ ...state, addingClient: true }),
  [ADD_CLIENT_END]: (state, { payload }) => {
    let { clients: { info: { other_clients = [] } } } = state;
    if (payload && payload.length)
      other_clients = other_clients.concat(payload)
    return ({
      ...state,
      clients: {
        ...state.clients,
        info: {
          ...state.clients.info,
          other_clients
        }
      },
      addingClient: false
    })
  },
  [CLIENT_ACTION]: clientActionHandler,
  [CLEAN_CLIENT_LIST]: cleanClientList,
  [FIX_AND_MERGE_NON_MUSERS]: (state, { payload }) => ({
    ...state,
    clients: {
      ...state.clients,
      info: {
        ...state.clients.info,
        other_clients: [
          ...state.clients.info.other_clients,
          ...fixNonMuserList(payload)
        ],
        clients_count: state.clients.info.clients_count + payload.length
      }
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
