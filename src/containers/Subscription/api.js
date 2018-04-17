import apiCall from '../../libs/api/apiRequest';
import endPoints from '../../libs/api/endpoints'

export function getPlans() {
  const query = { promos: true }
  const endpoint = endPoints.plans
  return apiCall({ endpoint, query })
}

export default {
  getPlans
}
