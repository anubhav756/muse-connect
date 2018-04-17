import apiCall from '../../libs/api/apiRequest';
import endPoints from '../../libs/api/endpoints'

export default function account(payload) {
  return apiCall({
    method: 'put',
    endpoint: endPoints.me,
    payload
  });
}

export function getPlansAccount() {
  const endpoint = endPoints.plans
  return apiCall({ endpoint })
}

export function getTransactions(nextURL) {
  const endpoint = endPoints.transactions;

  if (nextURL)
    return apiCall({ url: nextURL });

  return apiCall({ endpoint });
}

export function updatePayment(token) {
  const endpoint = endPoints.card;
  const payload = { token };
  
  return apiCall({
    method: 'PATCH',
    endpoint,
    payload
  });
}
