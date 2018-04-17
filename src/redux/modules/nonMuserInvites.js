// Imports
import _ from 'lodash'
import {
  getClientInvitesApiNonMuser,
  resendInviteApiNonMuser,
  cancelInviteApiNonMuser
} from '../../containers/ClientList/api'
import { notify } from './notice'
import { applyClientAction } from '../../libs/helpers/clientList'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_INVITATIONS_NON_MUSER_START = 'FETCH_INVITATIONS_NON_MUSER_START'
export const FETCH_INVITATIONS_NON_MUSER_ERROR = 'FETCH_INVITATIONS_NON_MUSER_ERROR'
export const FETCH_INVITATIONS_NON_MUSER_END = 'FETCH_INVITATIONS_NON_MUSER_END'
export const RESEND_INVITATION_NON_MUSER_START = 'RESEND_INVITATION_NON_MUSER_START'
export const RESEND_INVITATION_NON_MUSER_END = 'RESEND_INVITATION_NON_MUSER_END'
export const CANCEL_INVITATION_NON_MUSER_START = 'CANCEL_INVITATION_NON_MUSER_START'
export const CANCEL_INVITATION_NON_MUSER_END = 'CANCEL_INVITATION_NON_MUSER_END'
export const CLEAN_NON_MUSER_LIST = 'CLEAN_NON_MUSER_LIST' // to update the info key with non altered list as came from api
export const ADD_INVITATION_NON_MUSER = 'ADD_INVITATION_NON_MUSER'
// ------------------------------------
// Actions
// ------------------------------------

// fetch clients with invite who don't have muse account yet.
export function fetchInvitedNonMuserFromApi(done = () => { }) {
  return (dispatch) => {
    dispatch({ type: FETCH_INVITATIONS_NON_MUSER_START })
    getClientInvitesApiNonMuser()
      .then((res) => {
        dispatch({ type: FETCH_INVITATIONS_NON_MUSER_END, payload: res.body })
        done()
      })
      .catch(() => {
        dispatch({ type: FETCH_INVITATIONS_NON_MUSER_ERROR })
        done(true)
      })
  }
}

export function getInvitedNonMusers(done = () => { }) {
  return (dispatch, getState) => {
    const { nonMuserInvites: { info, clonedList } } = getState()
    if (_.isEmpty(info)) {
      return dispatch(fetchInvitedNonMuserFromApi(done))
    }
    // update the info key with the non altered list which came from api
    dispatch({ type: CLEAN_NON_MUSER_LIST, payload: clonedList })
    return done()
  }
}

export function resendInviteNonMuser(id, done = () => { }) {
  return (dispatch, getState) => {
    const { nonMuserInvites: { info } } = getState()
    const invitedClients = info.invites || []
    const { output: resendStartUpdatedList = [] } = applyClientAction(
      { id, input: invitedClients, clientAction: RESEND_INVITATION_NON_MUSER_START }
    )
    dispatch({
      type: RESEND_INVITATION_NON_MUSER_START,
      payload: { ...info, invites: resendStartUpdatedList }
    })
    resendInviteApiNonMuser(id)
      .then(() => {
        const { output: resendEndUpdatedList = [] } = applyClientAction(
          { id, input: invitedClients, clientAction: RESEND_INVITATION_NON_MUSER_END }
        )
        dispatch(notify({ message: 'Invitation has been re-sent' }))
        dispatch({
          type: RESEND_INVITATION_NON_MUSER_END,
          payload: { ...info, invites: resendEndUpdatedList }
        })
        done()
      })
      .catch((error) => {
        dispatch(notify({ error }))
        dispatch({
          type: RESEND_INVITATION_NON_MUSER_END,
          payload: { ...info, invites: invitedClients }
        })
        done(error)
      })
  }
}

export function cancelInviteNonMuser(id, done = () => { }) {
  return (dispatch, getState) => {
    const { nonMuserInvites: { info } } = getState()
    const invitedClients = info.invites || []
    const { output: cancelStartUpdatedList = [] } = applyClientAction(
      { id, input: invitedClients, clientAction: CANCEL_INVITATION_NON_MUSER_START }
    )
    dispatch({
      type: CANCEL_INVITATION_NON_MUSER_START,
      payload: { ...info, invites: cancelStartUpdatedList }
    })
    cancelInviteApiNonMuser(id)
      .then(() => {
        const { output: cancelEndUpdatedList = [] } = applyClientAction(
          { id, input: invitedClients, clientAction: CANCEL_INVITATION_NON_MUSER_END }
        )
        dispatch(notify({ message: 'Invitation has been cancelled' }))
        dispatch({
          type: CANCEL_INVITATION_NON_MUSER_END,
          payload: { ...info, invites: cancelEndUpdatedList }
        })
        done()
      })
      .catch((error) => {
        dispatch(notify({ error }))
        dispatch({
          type: CANCEL_INVITATION_NON_MUSER_END,
          payload: { ...info, invites: invitedClients }
        })
        done(error)
      })
  }
}

export function addNonMuserInvites(invites = []) {
  return (dispatch, getState) => {
    const { nonMuserInvites: { info, clonedList } } = getState()
    const infoInvites = info.invites || []
    const clonedInvites = clonedList.invites || []
    const updatedInfoInvites = { ...info, invites: [...invites, ...infoInvites] }
    const updatedClonedInvites = { ...clonedList, invites: [...invites, clonedInvites] }
    dispatch({
      type: ADD_INVITATION_NON_MUSER,
      payload: { info: updatedInfoInvites, clonedList: updatedClonedInvites }
    })
  }
}
// ------------------------------------
// Action Handlers
// ------------------------------------
export const initialState = {
  isFetching: false,
  info: {}, // stores invites but gets altered to reflect real time actions
  clonedList: {}, // to store a copy of invites which came from api
  isError: false
}

const ACTION_HANDLERS = {
  [FETCH_INVITATIONS_NON_MUSER_START]: () => ({ ...initialState, isFetching: true }),
  [FETCH_INVITATIONS_NON_MUSER_END]: (state, action) =>
    ({ ...state, info: action.payload, isFetching: false, clonedList: action.payload }),
  [FETCH_INVITATIONS_NON_MUSER_ERROR]: state => ({ ...state, isError: true, isFetching: false }),
  [RESEND_INVITATION_NON_MUSER_START]: (state, action) => ({ ...state, info: action.payload }),
  [RESEND_INVITATION_NON_MUSER_END]: (state, action) => ({ ...state, info: action.payload }),
  [CANCEL_INVITATION_NON_MUSER_START]: (state, action) => ({ ...state, info: action.payload }),
  [CANCEL_INVITATION_NON_MUSER_END]: (state, action) => ({ ...state, info: action.payload }),
  [CLEAN_NON_MUSER_LIST]: (state, action) => ({ ...state, info: action.payload }),
  [ADD_INVITATION_NON_MUSER]: (state, action) => ({
    ...state,
    info: action.payload.info,
    clonedList: action.payload.clonedList
  })
}
// ------------------------------------
// Reducer
// ------------------------------------
export default function nonMuserInvites(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
