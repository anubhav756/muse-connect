import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import { DefaultLayout } from '../../../layout'
import endPoints from '../../../routes/endPoints'
import { stepperProps } from '../../../containers/OnBoardingSteps/OnBoardingSteps'
import { _isRegisterd, _wasSubscribed } from '../../../libs/helpers/reduxAuth'
import OnBoardingSteps from '../../../containers/OnBoardingSteps'
import { isEmpty } from '../../../libs/helpers/common'
import { cleverTapSignupStart } from '../../../libs/cleverTap'

const defaultValidStepIndex = 0
let possibleValidStepIndex = 0

const signUpStart = _.debounce(cleverTapSignupStart, 1000);

/*
 * @function _updatePossibleValidStepIndex
 * updates the possibleValidStepIndex
 * @param {number} index
 */
function _updatePossibleValidStepIndex(index) {
  possibleValidStepIndex = index
}

/*
 * @function getPossibleValidStepIndex
 * returns the possibleValidStepIndex
 */
export function getPossibleValidStepIndex() {
  return possibleValidStepIndex
}

/*
 * @function _getPossibleEligibleStep
 * @param {object} user
 * @returns the possibleEligibleStep info
 */
function _getPossibleEligibleStep(user) {
  let validStepIndex = defaultValidStepIndex  // default,,,,
  const userInfo = user && user.info
  // checking from certification step
  for (let index = stepperProps.length - 2; index >= 0; index -= 1) {
    // gets the keyValues from stepperProps specified index
    const keyVal = _.pick(userInfo || {}, stepperProps[index].key)
    // if value find in payload then the next step would be the step to go
    if (!isEmpty(keyVal) && !stepperProps[index + 1].disabled) {
      validStepIndex = index + 1;
      break;
    }
  }
  return stepperProps[validStepIndex]
}

/*
 * @function _isEligibleStep(checks if the user is eligible to the step he is accessing)
 * @param {object} user
 * @param {object} location
 * @returns {Boolean/string}
 */
function _isEligibleStep(user, location) {
  const { pathname } = location
  const userInfo = user && user.info
  // get index of object storing info by pathname
  const index = _.findIndex(stepperProps || [], ['route', pathname])
  if (index === -1) {
    return false;
  }

  const keyVal = _.pick(userInfo || {}, stepperProps[index].key)
  return (index === defaultValidStepIndex) || !isEmpty(keyVal)
}

/*
 * @export function onBoardingNextStep controller function determines the route protection
 * for onBoarding steps
 * @param {any} props
 * @returns
 */
export function onBoardingNextStep(props) {
  const { user, location } = props
  // user is registered return false will redirect it to failure route
  if (_isRegisterd(user) || _wasSubscribed(user)) {
    return false;
  }

  // check the user iseligible to the accessed step
  const isEligible = _isEligibleStep(user, location)
  // get the eligibleStep
  const possibleEligibleStep = _getPossibleEligibleStep(user)
  // get the user to the eligible step
  if (!isEligible && possibleEligibleStep.route !== location.pathname) {
    // clevertap log signup start event if on first step
    if (possibleEligibleStep.label === 'Basic Information') {
      signUpStart();
    }
    // get to the eligible step
    browserHistory.replace(possibleEligibleStep.route)
    return true
  }
  // get the index of valid step
  const possibleStepIndex = _.findIndex(stepperProps || [], ['key', possibleEligibleStep.key])
  if (possibleStepIndex > -1) {
    _updatePossibleValidStepIndex(possibleStepIndex)
  }
  return true
}

function processOnBoardingSteps(props) {
  const { user, location } = props
  if (!onBoardingNextStep({ user, location })) {
    browserHistory.replace(endPoints.dashboard)
  }
}
class UserIsRegistered extends Component {
  componentWillMount() {
    processOnBoardingSteps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    processOnBoardingSteps(nextProps)
  }

  render() {
    return (
      <DefaultLayout>
        <OnBoardingSteps>
          {this.props.children}
        </OnBoardingSteps>
      </DefaultLayout>
    )
  }
}

export default connect(({ user }) => ({ user }))(UserIsRegistered)
