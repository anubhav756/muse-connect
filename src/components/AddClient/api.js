import apiCall from '../../libs/api/apiRequest';
import endPoints from '../../libs/api/endpoints'

export default function addClient(payload) {
  return apiCall({
    method: 'post',
    endpoint: endPoints.clients,
    payload
  });
}
