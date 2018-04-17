import { browserHistory } from 'react-router'
import endPoints from '../../routes/endPoints'

export function redirectToProfile(id) {
  browserHistory.push(`${endPoints.client.index}/${id}`)
}

export function redirectToArticleDetails(id) {
  browserHistory.push(`${endPoints.learn}/${id}`)
}

export function redirectToProductPage(id) {
  browserHistory.push(`${endPoints.shop}/${id}`)
}

export default { redirectToProfile }
