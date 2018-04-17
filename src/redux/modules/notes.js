// imports
import _ from 'lodash'
import { notify } from './notice'
import { getNotesApi, deleteNoteApi, updateNoteApi, addNoteApi } from '../../containers/Client/api'
import {
  CREATED_DATE,
  applyNotesSort as _applyNotesSort
} from '../../libs/helpers/notes';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_NOTES_START = 'GET_NOTES_START';
export const GET_NOTES_END = 'GET_NOTES_END';
export const GET_NOTES_ERROR = 'GET_NOTES_ERROR';
export const NOTE_ACTION_START = 'NOTE_ACTION_START';
export const NOTE_ACTION_END = 'NOTE_ACTION_END';
export const SET_CLIENT_ID = 'SET_CLIENT_ID';
export const APPLY_NOTES_SORT = 'APPLY_NOTES_SORT';

// ------------------------------------
// Actions
// ------------------------------------

export function applyNotesSort(column) {
  return dispatch => dispatch({ type: APPLY_NOTES_SORT, payload: column });
}

export function setClientId(clientId) {
  return (dispatch) => {
    dispatch({ type: SET_CLIENT_ID, payload: clientId })
  }
}

export function saveNotes(notes) {
  return (dispatch) => {
    dispatch({ type: GET_NOTES_END, payload: notes });
  }
}

export function applyNoteAction(info) {
  return (dispatch) => {
    dispatch({ type: NOTE_ACTION_END, payload: info })
  }
}

export function fetchNotes(clientId) {
  return (dispatch) => {
    dispatch({ type: GET_NOTES_START })
    getNotesApi(clientId)
      .then((res) => {
        dispatch(setClientId(clientId))
        const { notes } = res.body
        dispatch(saveNotes(notes))
      })
      .catch((error) => {
        dispatch(notify({ error }))
        dispatch({ type: GET_NOTES_ERROR })
      })
  }
}

export function getNotes(clientId) {
  return (dispatch, getState) => {
    const { notes: { info, clientId: _clientId } } = getState()
    if (_.isEmpty(info) || clientId !== _clientId) {
      return dispatch(fetchNotes(clientId))
    }
    dispatch(saveNotes(info))
  }
}

export function deleteNote(noteId) {
  return (dispatch, getState) => {
    const { notes: { info } } = getState()
    dispatch({ type: NOTE_ACTION_START })
    deleteNoteApi(noteId)
      .then(() => {
        const index = _.findIndex(info, { id: noteId })
        if (index > -1) {
          info.splice(index, 1)
        }
        dispatch(applyNoteAction(info))
      })
      .catch((error) => {
        dispatch(notify(error))
        dispatch(applyNoteAction(info))
      })
  }
}

export function updateNote(noteDetails, cb = () => { }) {
  return (dispatch, getState) => {
    const { notes: { info } } = getState()
    dispatch({ type: NOTE_ACTION_START })
    updateNoteApi(noteDetails)
      .then((res) => {
        const index = _.findIndex(info, { id: noteDetails.id })
        if (index > -1) {
          info[index] = res.body.note
        }
        dispatch(applyNoteAction(info))
        dispatch(applyNotesSort());
        cb()
      })
      .catch((error) => {
        dispatch(notify(error))
        dispatch(applyNoteAction(info))
      })
  }
}

export function addNote(clientId, noteDetails, cb = () => { }) {
  return (dispatch, getState) => {
    const { notes: { info } } = getState()
    dispatch({ type: NOTE_ACTION_START })
    addNoteApi(clientId, noteDetails)
      .then((res) => {
        const _info = [res.body.note, ...info]
        dispatch(applyNoteAction(_info))
        dispatch(applyNotesSort());
        cb()
      })
      .catch((error) => {
        dispatch(notify(error))
        dispatch(applyNoteAction(info))
      })
  }
}
// ------------------------------------
// Action handlers
// ------------------------------------
export const initialState = {
  isFetching: false,
  isError: false,
  info: [],
  clientId: '',
  isAction: false,
  sortByColumn: CREATED_DATE
};

const ACTION_HANDLERS = {
  [GET_NOTES_START]: state => ({ ...state, isFetching: true }),
  [GET_NOTES_END]: (state, action) =>
    ({ ...state, isFetching: false, isError: false, info: action.payload }),
  [GET_NOTES_ERROR]: state => ({ ...state, isError: true }),
  [SET_CLIENT_ID]: (state, action) => ({ ...state, clientId: action.payload }),
  [NOTE_ACTION_START]: state => ({ ...state, isAction: true }),
  [NOTE_ACTION_END]: (state, action) =>
    ({ ...state, isAction: false, info: action.payload }),
  [APPLY_NOTES_SORT]: (state, action) => {
    const sortByColumn = action.payload || state.sortByColumn;
    const reverse = action.payload ?
      !state.reverse && state.sortByColumn === action.payload :
      state.reverse;

    return {
      ...state,
      sortByColumn,
      reverse,
      info: _applyNotesSort(state.info, sortByColumn, reverse)
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function notesReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
