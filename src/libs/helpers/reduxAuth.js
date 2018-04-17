import { isEmpty } from './common'
/*
 * @function _isRegisterd checks if the user is already registered
 * @param {object} user
 * @returns {boolean}
 */
export function _isRegisterd(user) {
  return user &&
    user.info &&
    user.info.subscriptions &&
    !isEmpty(user.info.subscriptions) &&
    user.info.wasSubscriber
}

/*
 * @function _wasSubscribed checks if the user was a subscribed user
 * @param {object} user
 * @returns {boolean}
 */
export function _wasSubscribed(user) {
  return user &&
    user.info &&
    (!user.info.subscriptions || isEmpty(user.info.subscriptions)) &&
    user.info.wasSubscriber
}

/*
 *
 * @export _isOnboardComplete checks if user has completed onboard once
 * @param {object} user
 * @returns {boolean}
 */
export function _isOnboardComplete(user = {}) {
  return user.info && user.info.wasSubscriber
}
