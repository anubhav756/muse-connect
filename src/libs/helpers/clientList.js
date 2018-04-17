import _ from 'lodash'
import { isDate } from './common'
// ------------------------------------
// Sort column names
// ------------------------------------
export const CLIENT_NAME = 'CLIENT_NAME';
export const THIS_WEEK = 'THIS_WEEK';
export const TIME_SPENT = 'TIME_SPENT';
export const LAST_SESSION = 'LAST_SESSION';
export const CLIENT_SINCE = 'CLIENT_SINCE';
export const RECENTLY_VIEWED = 'RECENTLY_VIEWED';
export const STATUS = 'STATUS';

// ------------------------------------
// Status filters
// ------------------------------------
export const ALL = 'ALL';
export const ACCEPTED = 'ACCEPTED';
export const ARCHIVED = 'ARCHIVED';
export const INVITED = 'INVITED';
export const DENIED = 'DENIED';
export const STOPPED = 'STOPPED';

// keys values pair where values are the mapping w.r.t the client payload
const StatusFilterToApiKeyMap = {
  [DENIED]: { status: DENIED },
  [INVITED]: { status: INVITED },
  [ARCHIVED]: { status: ARCHIVED },
  [STOPPED]: { status: STOPPED }
}

function sortByStatus(o) {
  return (
    o.status === STOPPED ? -1 :
    o.status === ARCHIVED ? -2 :
    o.status === INVITED ? -3 :
    false
  );
}

const SortColumnToKeyMap = {
  [CLIENT_NAME]: o => ((o.first_name + o.last_name) || o.email).toLowerCase(),
  [RECENTLY_VIEWED]: o => isDate(o.last_viewed_date) && new Date(o.last_viewed_date),
  [THIS_WEEK]: o => sortByStatus(o) || o.sessions_last_week && o.sessions_last_week.length,
  [TIME_SPENT]: o => sortByStatus(o) || o.sessions_last_week && o.session_minutes_total,
  [LAST_SESSION]: o => isDate(o.last_session) && new Date(o.last_session),
  [CLIENT_SINCE]: o => isDate(o.accepted_date) && new Date(o.accepted_date),
  [STATUS]: o => o.status
}

/*
 * @function applyStatusFilter filters the client respect to the selected filter
 * @param {array} clients stores the client list to be filtered
 * @param {filterType} selected status filter
 * @returns Array of clients filtered
 */
export function applyStatusFilter(clients = {
  active_clients: [],
  other_clients: [],
  archived_clients: []
}, filterType) {
  if (!filterType || filterType === ALL)
    return [...clients.active_clients, ...clients.archived_clients, ...clients.other_clients];
  if (filterType === ACCEPTED)
    return [...clients.active_clients];
  if (filterType === ARCHIVED)
    return [...clients.archived_clients];
  return _.filter(clients.other_clients, StatusFilterToApiKeyMap[filterType])
}

/*
 * @function applySort sorts the clients with respect to the selected sort column
 * @param {array} clients stores the client list to be sorted
 * @param {sortColumn} selected sort column
 * @returns Array of clients sorted
 */
export function applySort(clients = [], sortColumn, reverse) {
  const asc = sortColumn !== CLIENT_NAME ? 'desc' : 'asc';
  const desc = sortColumn !== CLIENT_NAME ? 'asc' : 'desc';
  return _.orderBy(clients, SortColumnToKeyMap[sortColumn], reverse ? desc : asc)
}

/*
 * @function applyClientAction
 *  takes id on which clientAction supposed to be applied
 *  it searches the id in input = [] items, append __clientAction key equal to clientAction
 *  if output array is passed as param then it deletes the searched item from input array
 *  and adds to theoutput array
 *  if output array is not passed as param then it updates the input array
 *  returns object having the input and output as result keys
 */
export function applyClientAction({ id, input = [], output, clientAction, status }) {
  const clonedInput = _.clone(input)
  const clonedOutput = _.clone(output)
  const index = _.findIndex(clonedInput, { id })
  if (index < 0) {
    return { input, output }
  }
  const updatedItem = clonedInput[index]
  updatedItem.__clientAction = clientAction
  if (status) updatedItem.status = status

  // if output array is given then delete index element from input array and concat to output array
  if (clonedOutput) {
    clonedInput.splice(index, 1)
    return { input: clonedInput, output: clonedOutput.concat(updatedItem) }
  }
  // update input and output array with the same updated list
  clonedInput[index] = updatedItem
  return { input: clonedInput, output: clonedInput }
}

export default { applyStatusFilter, applySort, applyClientAction }
