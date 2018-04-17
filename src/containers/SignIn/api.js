import apiCall from '../../libs/api/apiRequest';
import endPoints from '../../libs/api/endpoints';

export default function getMeApi() {
  return apiCall({ endpoint: endPoints.me });
}
