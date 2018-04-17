import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'

import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss'

import Icon from '../../components/Icon'
import StepperItem from './StepperItem'

import './Stepper.scss'

// defined style constants
const iconStyle = { height: '14px', width: '14px', verticalAlign: 'middle' }
const buttonLabelStyle = { textTransform: 'none', fontSize: '15px', padding: '0px 10px' }
const buttonStyle = { width: 'auto', color: styleVariables.darkGrey }
/*
 * @function goToStep calls the callback function onGoToStep which redirects to the
 *  step of specified index.
 * @param {number} index stores the index of step
 */
function goToStep(index) {
  const { onGoToStep } = this.props
  onGoToStep(index)
}

/*
 * @function doSaveNext calls the callback function onSaveNext.
 * @param {number} index stores the index of step
 */
function doSaveNext() {
  const { onSaveNext } = this.props
  onSaveNext()
}

/*
 * @function isDisabled
 * @param {number} index stores the index of step for which the status to be calculated
 * @returns bool specify whether the index is disabled or not
 */
function isDisabled(index) {
  const { steps, validIndex } = this.props
  return (steps[index] && steps[index].disabled) || index > validIndex || index < 0
}

/*
 * @function doCancel calls the callback function onCancelAction
 */
function doCancel() {
  const { onCancelAction } = this.props
  onCancelAction()
}

class Stepper extends Component {

  constructor(props) {
    super(props)
    this.goToStep = goToStep.bind(this)
    this.doSaveNext = doSaveNext.bind(this)
    this.isDisabled = isDisabled.bind(this)
    this.doCancel = doCancel.bind(this)
  }

  render() {
    const { steps, cancelAction, activeIndex, windowDimension, saveNext, hideSave, showCancel } = this.props
    const True = true
    const isPrevDisable = this.isDisabled(activeIndex - 1)
    // fix break of steps b/w 1024 to 1100 px
    const stepLabelStyle = windowDimension && windowDimension.innerWidth < 1100
      ? { ...buttonLabelStyle, padding: '0' }
      : buttonLabelStyle

    return (
      <div>
        <Row className="onlyDesktop">
          <Col mdOffset={3} md={9} className="stepperHeader" >
            <Row>
              <Col mdOffset={1} md={7} className="stepperItems">
                {
                  steps && steps.map((step, index) => {
                    const disable = this.isDisabled(index)
                    const active = (index === activeIndex)

                    return (<div className="stepperItem" key={step.label} >
                      <StepperItem
                        id={step.label}
                        label={step.label}
                        disabled={disable}
                        labelStyle={active ? { ...stepLabelStyle, fontWeight: '600' } : stepLabelStyle}
                        onClick={() => this.goToStep(index)}
                        style={
                          disable
                            ? { color: styleVariables.lightGrey }
                            : { color: styleVariables.darkGrey }
                        }
                      />
                      {
                        step.icon &&
                        <Icon name={step.icon} style={iconStyle} fill={styleVariables.lightGrey} />
                      }
                    </div>)
                  })
                }
              </Col>
              <Col md={4}>
                {
                  cancelAction &&
                  <div className="actionItem">
                    <StepperItem
                      id={cancelAction.label}
                      label={<div className="stepperItem"><span className="actionLabel">{cancelAction.label}</span></div>}
                      onClick={this.doCancel}
                      labelStyle={buttonLabelStyle}
                      style={buttonStyle}
                    />
                  </div>
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="stepperFooter">
          <Col xs={4} md={3}>
            <StepperItem
              id="Previous"
              label={<div className="stepperItem">
                <Icon name={'chevron-left'} style={{ ...iconStyle, marginRight: '14px' }} fill={isPrevDisable ? styleVariables.lightGrey : styleVariables.darkGrey} />
                <span className="exceptMobile actionLabel">Previous</span>
              </div>}
              disabled={isPrevDisable}
              onClick={() => this.goToStep(activeIndex - 1)}
              labelStyle={buttonLabelStyle}
              style={{
                ...buttonStyle,
                color: isPrevDisable ? styleVariables.lightGrey : styleVariables.darkGrey
              }}
            />
          </Col>
          <Col xs={4} md={6}>
            <div className="stepperStatus">
              <span className="onlyDesktop">
                Contact us at <a className="hyperLink" href="mailto:customercare@choosemuse.com">customercare@choosemuse.com</a>
              </span>
              <span className="exceptDesktop">
                {/* <Icon name="pagination" totalSteps={steps && steps.length} activeStep={activeIndex} fill={styleVariables.lightGrey} activeFill={styleVariables.teal} width="43" height="7" /> */}
                <a className="hyperLink" href="mailto:customercare@choosemuse.com">Help</a>
              </span>
            </div>
          </Col>
          <Col xs={4} md={3} className="actionItem">
            {
              !hideSave
              ? <StepperItem
                id="Save and Continue"
                label={<div className="stepperItem">
                  <span className="exceptMobile actionLabel">Save and Continue</span>
                  <Icon fill={saveNext ? styleVariables.lightGrey : styleVariables.darkGrey} name={'chevron-right'} style={{ ...iconStyle, marginLeft: '14px' }} />
                </div>}
                onClick={() => this.doSaveNext()}
                labelStyle={buttonLabelStyle}
                disabled={saveNext}
                style={{
                  ...buttonStyle,
                  color: saveNext ? styleVariables.lightGrey : styleVariables.darkGrey
                }}
              />
              : <div className="actionItem">
                {
                  showCancel &&
                  <StepperItem
                    id={cancelAction.label}
                    label={<div className="stepperItem"><span className="onlyDesktop actionLabel">{cancelAction.label}</span><span className="exceptDesktop actionLabel">{'Cancel'}</span><span><Icon style={{ ...iconStyle, marginLeft: '14px' }} name={'x-icon'} /></span></div>}
                    onClick={this.doCancel}
                    labelStyle={buttonLabelStyle}
                    style={buttonStyle}
                  />
                }
              </div>
            }
          </Col>
        </Row>
      </div>
    )
  }
}

Stepper.propTypes = {
  windowDimension: PropTypes.object.isRequired,
  activeIndex: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  cancelAction: PropTypes.object.isRequired,
  saveNext: PropTypes.bool.isRequired,
  hideSave: PropTypes.bool.isRequired,
  showCancel: PropTypes.bool
}

Stepper.defaultProps = {
  showCancel: true
}
// injected into connect call returns the windowDimension from redux store
function mapStateToProps({ windowDimension }) {
  return { windowDimension }
}

/**
 * @functionCall connect binds the component with redux store state
 */
export default connect(mapStateToProps)(Stepper)
