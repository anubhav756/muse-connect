import endPoints from '../../libs/api/endpoints'
import apiCall from '../../libs/api/apiRequest'

export default function getAllClientSessionsApi() {
  const endpoint = endPoints.clientAggregates
  const method = 'get'
  return apiCall({ endpoint, method })
}
