import formNames from './formNames'
import endPoints from '../../routes/endPoints'

const routeNameMap = {
  [`${endPoints.onboarding.index}/${endPoints.onboarding.certification}`]: formNames.certification,
  [`${endPoints.onboarding.index}/${endPoints.onboarding.terms}`]: formNames.terms,
  [`${endPoints.onboarding.index}/${endPoints.onboarding.subscription}`]: formNames.subscription
}

export function getFormNameByRoute(route) {
  return routeNameMap[route] || false
}

const utilities = {
  getFormNameByRoute
}

export default utilities
