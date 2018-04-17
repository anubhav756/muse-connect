import apiCall from '../../libs/api/apiRequest';
import endPoints from '../../libs/api/endpoints'

export default function onboardingApi(payload) {
  return apiCall({ endpoint: endPoints.me, method: 'put', payload })
}
