import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { mount } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

import Stepper from '../../src/components/Stepper'
import StepperItem from '../../src/components/Stepper/StepperItem'
import endPoints from '../../src/routes/endPoints'


const storeState = {
  windowDimension: { innerWidth: 1023 }
}

const onGoToStepSpy = sinon.spy()
const onSaveNextSpy = sinon.spy()
const onCancelActionSpy = sinon.spy()

const stepperProps = [
  { key: ['user_id'], label: 'Basic Information', route: `/${endPoints.onboarding.basicInformation}`, icon: 'chevron-right' },
  { key: ['pro_certBody', 'pro_certNumber'], label: 'Professional Certification', route: `${endPoints.onboarding.index}/${endPoints.onboarding.certification}`, icon: 'chevron-right' },
  { key: ['subscribed'], label: 'Subscription', route: `${endPoints.onboarding.index}/${endPoints.onboarding.subscription}` }
]

const cancelActionProp = { label: 'Cancel Registration' }
const activeIndex = 2
const saveNext = false

const Props = {
  activeIndex,
  onGoToStep: onGoToStepSpy,
  onCancelAction: onCancelActionSpy,
  onSaveNext: onSaveNextSpy,
  steps: stepperProps,
  cancelAction: cancelActionProp,
  hideSave: true,
  saveNext
}

const getContext = State => ({
  store: {
    getState: () => (State),
    subscribe: () => {},
    dispatch: () => {}
  },
  muiTheme: getMuiTheme(),
})

describe('(Component) Stepper', () => {
  let context = getContext(storeState)

  beforeAll(() => {
    context = getContext(storeState)
  })

  const buildWrapper = () => (
    mount(<Stepper {...Props} />,
      {
        context,
        childContextTypes: {
          muiTheme: PropTypes.object,
          store: PropTypes.object
        }
      })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    should.exist(wrapper)
  })

  describe('should render', () => {
    const wrapper = buildWrapper()
    it('should render total six action buttons', () => {
      wrapper.find('button').should.have.length(6)
    })

    it('should render action buttons for steps', () => {
      stepperProps.map(step => (
        wrapper.containsAnyMatchingElements([<StepperItem id={step.label} />]).should.be.true()
      ))
    })

    it('should have action buttons for cancel registration', () => {
      wrapper.containsAnyMatchingElements([<StepperItem id="Cancel Registration" />]).should.be.true()
    })

    it('should render action button to go Previous step', () => {
      wrapper.containsAnyMatchingElements([<StepperItem id="Previous" />]).should.be.true()
    })
  })

  describe('action events', () => {
    const wrapper = buildWrapper()

    it('should call "onGoToStep" callback as touchTap event happens at "Previous" button', () => {
      const element = wrapper.find({ id: 'Previous' }).at(0)
      element.props().onClick()
      wrapper.update()
      onGoToStepSpy.should.be.calledWith(1)
    })

    it('should call "onCancelAction" callback as touchTap event happens at "Cancel Registration" button', () => {
      const element = wrapper.find({ id: 'Cancel Registration' }).at(0)
      element.props().onClick()
      wrapper.update()
      onCancelActionSpy.should.be.calledOnce()
    })

    it('should call "onGoToStep" callback as touchTap event happens at "Professional Certification" button', () => {
      const element = wrapper.find({ id: 'Professional Certification' }).at(0)
      element.props().onClick()
      wrapper.update()
      onGoToStepSpy.should.be.calledWith(1)
    })

    it('should call "onGoToStep" callback as touchTap event happens at "Subscription" button', () => {
      const element = wrapper.find({ id: 'Subscription' }).at(0)
      element.props().onClick()
      wrapper.update()
      onGoToStepSpy.should.be.calledWith(2)
    })

    it('"Basic Information" step button should not be disabled', () => {
      const element = wrapper.find({ id: 'Basic Information' })
      element.at(0).props().disabled.should.be.false()
    })

    it('should never call "onGoToStep" callback as button should be disabled for Basic Information', () => {
      const element = wrapper.find({ id: 'Basic Information' })
      element.at(0).props().onClick()
      wrapper.update()
      onGoToStepSpy.should.be.calledWith(0)
    })
  })
})
