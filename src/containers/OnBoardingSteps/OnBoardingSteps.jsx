import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { submit } from 'redux-form'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import _ from 'lodash'

import Stepper from '../../components/Stepper'
import endPoints from '../../routes/endPoints'
import { getFormNameByRoute } from '../../libs/form/utilities'
import { getPossibleValidStepIndex } from '../../components/RouterWrappers/UserIsRegistered/UserIsRegistered'
import { logoutUser } from '../../redux/modules/user'

import './OnBoardingSteps.scss'

export const stepperProps = [
  { key: ['tosAccepted'], label: 'Basic Information', route: `${endPoints.onboarding.index}/${endPoints.onboarding.terms}`, icon: 'chevron-right' },
  { key: ['eligiblePro'], label: 'Business and Profession', route: `${endPoints.onboarding.index}/${endPoints.onboarding.certification}`, icon: 'chevron-right' },
  { key: ['planName'], label: 'Subscription', route: `${endPoints.onboarding.index}/${endPoints.onboarding.subscription}` }
]

const cancelActionProp = { label: 'Sign Out' }

/**
 * @function hideSave
 * @param {number} activeIndex of current active step
 * @returns bool whether to show or hide Save and Continue button at Stepper component
 */
function hideSave(activeIndex) {
  return (stepperProps[activeIndex] && stepperProps[activeIndex].label) && true
}

/*
 * @function handleCancel handles the cancel action callback
 */
function handleCancel() {
  this.props.logoutUser({ notificationMsg: false })
}

/*
* @function getter getActiveIndex gets the active index for the stepper wizard calculates
* by getting current route
*/
function getActiveIndex(stepperProperties) {
  const { context } = this
  const pathname = context &&
    context.router &&
    context.router.location &&
    context.router.location.pathname
  const index = _.findIndex(stepperProperties, { route: pathname })
  if (index !== -1) {
    return index
  }
}

/*
* @function handleGoToStep callback function redirects to the route gets by map the
*  specified index
* @param {number} index
*/
function handleGoToStep(index) {
  const route = stepperProps[index] && stepperProps[index].route
  if (route) {
    browserHistory.push(route)
  }
}

/*
* @function handleSaveNext callback function
* handles remote submit
*/
function handleSaveNext() {
  const activeIndex = this.getActiveIndex(stepperProps)
  const { context: { store } } = this
  const route = stepperProps[activeIndex] && stepperProps[activeIndex].route
  const formName = getFormNameByRoute(route)
  if (route && formName) {
    store.dispatch(submit(formName))
  }
}

export class OnBoardingSteps extends Component {

  constructor(props) {
    super(props)
    this.handleGoToStep = handleGoToStep.bind(this)
    this.getActiveIndex = getActiveIndex.bind(this)
    this.handleSaveNext = handleSaveNext.bind(this)
    this.handleCancel = handleCancel.bind(this)
  }

  render() {
    const { children, onBoarding } = this.props
    const activeIndex = this.getActiveIndex(stepperProps)
    const possibleValidStepIndex = getPossibleValidStepIndex()
    return (
      <div className="onBoardContainer">
        <Stepper
          steps={stepperProps}
          cancelAction={cancelActionProp}
          onGoToStep={this.handleGoToStep}
          onSaveNext={this.handleSaveNext}
          saveNext={onBoarding.isSaving}
          onCancelAction={this.handleCancel}
          validIndex={possibleValidStepIndex}
          activeIndex={activeIndex}
          hideSave={hideSave(activeIndex)}
          showCancel={false}
        />
        {children}
      </div>
    )
  }
}

OnBoardingSteps.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

OnBoardingSteps.propTypes = {
  onBoarding: PropTypes.object.isRequired,
}

function mapStateToProps({ onBoarding }) {
  return { onBoarding }
}

export default connect(mapStateToProps, { logoutUser })(OnBoardingSteps)
