import apiCall from '../../libs/api/apiRequest';
import endPoints from '../../libs/api/endpoints';

export default function saveToken(payload) {
  const endpoint = endPoints.subscriptions;
  const method = 'put';
  return apiCall({ endpoint, method, payload });
}

export function usePromo(promoID) {
  const endpoint = `${endPoints.promos}/${promoID}`;
  const method = 'post';

  return apiCall({ endpoint, method });
}
