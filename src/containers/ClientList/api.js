import endPoints from '../../libs/api/endpoints'
import apiCall from '../../libs/api/apiRequest'

const ARCHIVE = 'archive'
const ACTIVE = 'unarchive'
const CANCEL = 'cancel'

export function getClients() {
  const endpoint = `${endPoints.clients}`
  return apiCall({ endpoint })
}

// TODO: API under development
export function resendInvitation(clientID) {
  const endpoint = `${endPoints.clients}/${clientID}/${endPoints.resendInvitation}`
  const method = 'post'
  return apiCall({ endpoint, method })
}

export function cancelInvitation(clientID) {
  const endpoint = `${endPoints.clients}/${clientID}`
  const method = 'put'
  const payload = { action: CANCEL }
  const query = { clientID }
  return apiCall({ endpoint, query, method, payload })
}

export function archiveUnarchive(clientID, unarchive) {
  const endpoint = `${endPoints.clients}/${clientID}`
  const method = 'put'
  const query = { clientID }
  const payload = { action: unarchive ? ACTIVE : ARCHIVE }
  return apiCall({ endpoint, method, query, payload })
}

export function getClientInvitesApiNonMuser() {
  const endpoint = endPoints.nonMuserInvites
  const method = 'get'
  return apiCall({ endpoint, method })
}

export function resendInviteApiNonMuser(id) {
  const endpoint = `${endPoints.nonMuserInvites}/${id}/resend`
  const method = 'post'
  return apiCall({ endpoint, method })
}

export function cancelInviteApiNonMuser(id) {
  const endpoint = `${endPoints.nonMuserInvites}/${id}`
  const method = 'delete'
  return apiCall({ endpoint, method })
}

export default {
  getClients,
  resendInvitation,
  cancelInvitation,
  archiveUnarchive,
  getClientInvitesApiNonMuser,
  resendInviteApiNonMuser
}
