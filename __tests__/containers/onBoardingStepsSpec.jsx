import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import 'should-sinon'
import { browserHistory } from 'react-router'
import sinon from 'sinon'
import { getMuiTheme } from 'material-ui/styles'

import OnBoardingSteps from '../../src/containers/OnBoardingSteps'
import Stepper from '../../src/components/Stepper'

import endPoints from '../../src/routes/endPoints'


const context = {
  router: { location: { pathname: `${endPoints.onboarding.index}/${endPoints.onboarding.certification}` } },
  store: {
    getState: () => ({ onBoarding: { isSaving: false }, windowDimension: {} }),
    subscribe: () => { },
    dispatch: () => { }
  },
  muiTheme: getMuiTheme()
}

describe('(Container) onBoardingSteps', () => {
  let contextRef = context
  const browserHistorySpy = sinon.spy(browserHistory, 'push')
  const dispatchSpy = sinon.spy(context.store, 'dispatch')

  beforeAll(() => {
    contextRef = context
  })

  const buildWrapper = () => (
    mount(<OnBoardingSteps >
      <div id="childComponent" />
    </OnBoardingSteps>, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        windowDimension: PropTypes.object,
        router: PropTypes.object,
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })

  it('should render Stepper component', () => {
    const wrapper = buildWrapper()
    wrapper.find(Stepper).should.have.length(1)
  })

  it('should render child Component', () => {
    const wrapper = buildWrapper()
    wrapper.find('#childComponent').should.have.length(1)
  })

  describe('Stepper component', () => {
    const wrapper = buildWrapper()
    const StepperComponent = wrapper.find(Stepper)
    it('should have cancelAction as props to Stepper component', () => {
      should.exist(StepperComponent.props().cancelAction)
    })

    it('should have onGoToStep as props to Stepper component', () => {
      should.exist(StepperComponent.props().onGoToStep)
    })

    it('should have onGoToStep should have reference to a function', () => {
      should.equal(typeof StepperComponent.props().onGoToStep === 'function', true)
    })

    it('should have onSaveNext as props to Stepper component', () => {
      should.exist(StepperComponent.props().onSaveNext)
    })

    it('should have onSaveNext should have reference to a function', () => {
      should.equal(typeof StepperComponent.props().onSaveNext === 'function', true)
    })

    it('should have onCancelAction as props to Stepper component', () => {
      should.exist(StepperComponent.props().onCancelAction)
    })

    it('should have onCancelAction should have reference to a function', () => {
      should.equal(typeof StepperComponent.props().onCancelAction === 'function', true)
    })

    it('should have validIndex as props to Stepper component', () => {
      should.exist(StepperComponent.props().validIndex)
    })

    it('should have activeIndex as props to Stepper component', () => {
      should.exist(StepperComponent.props().activeIndex)
    })

    it('should have activeIndex equal to 1', () => {
      should.equal(StepperComponent.props().activeIndex, 1)
    })

    it(`should push ${endPoints.onboarding.index}/${endPoints.onboarding.terms} when call onGoToStep(0)`, () => {
      StepperComponent.props().onGoToStep(0)
      browserHistorySpy.should.be.calledWith(`${endPoints.onboarding.index}/${endPoints.onboarding.terms}`)
    })

    it('should dispatch submit form Certification onSaveNext', () => {
      StepperComponent.props().onSaveNext()
      dispatchSpy.should.be.calledWith({ meta: { form: 'BProCertification' }, type: '@@redux-form/SUBMIT' })
    })
  })
})
