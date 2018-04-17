import endPoints from '../../libs/api/endpoints'
import apiCall from '../../libs/api/apiRequest'

export function getAggregateSessions(id) {
  const endpoint = `${endPoints.clients}/${id}`
  const method = 'GET'
  return apiCall({ endpoint, method })
}

export function getDailySessionsApi(id, cursor, limit = 10) {
  const query = {
    limit,
  }
  if (cursor) {
    const url = cursor
    return apiCall({ url, query })
  }
  const endpoint = `${endPoints.clients}/${id}/sessions`
  return apiCall({ endpoint, query })
}

export function getNotesApi(id) {
  const endpoint = `${endPoints.clients}/${id}/notes`
  return apiCall({ endpoint })
}

export function deleteNoteApi(id) {
  const endpoint = `${endPoints.notes}/${id}`
  const method = 'DELETE'
  return apiCall({ endpoint, method })
}

export function updateNoteApi(payload) {
  const endpoint = `${endPoints.notes}/${payload.id}`
  const method = 'PUT'
  return apiCall({ endpoint, payload, method })
}

export function addNoteApi(id, payload) {
  const endpoint = `${endPoints.clients}/${id}/notes`
  const method = 'POST'
  return apiCall({ endpoint, payload, method })
}
