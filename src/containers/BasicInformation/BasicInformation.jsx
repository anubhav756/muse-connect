import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Col, Row } from 'react-flexbox-grid'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem';

import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss'

import { Countries } from '../../libs/constants/Countries'
import { CanadaProvinces, UsStates } from '../../libs/constants/StateProvince'
import { isValidTel } from '../../libs/helpers/validator'
import Error from '../../components/Error';
import CheckBox from '../../components/CheckBox';
import Modal from '../../components/Modal'
import ReadMore from './ReadMore'
import { doCompleteRegister } from '../../redux/modules/basicInfo'
import './BasicInformation.scss'

const tosLabel =
  (<div>
    I have read and agreed to the Muse<sup>TM</sup> Connect <Link target="_blank" href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf" className="hyperLink">Terms of Service</Link> and <Link target="_blank" href="http://www.choosemuse.com/legal/privacy" className="hyperLink">Privacy Policy</Link>.
  </div>)

// stores validation rules for fields
const validate = (values) => {
  const errors = {}
  if (!values.firstName || !values.firstName.trim()) {
    errors.firstName = <Error errorText="Required" />
  }
  if (!values.lastName || !values.lastName.trim()) {
    errors.lastName = <Error errorText="Required" />
  }
  if (!values.tosAccepted) {
    errors.tosAccepted = (<Error
      textStyle={{ fontSize: '12px', color: styleVariables.red }}
      errorText="Required"
      style={{ textAlign: 'left', minHeight: '20px', marginTop: '2px' }}
    />)
  }
  if (!values.currentMuser && values.currentMuser !== false) {
    errors.currentMuser = (<Error
      textStyle={{ fontSize: '12px', color: styleVariables.red }}
      errorText="Required"
      style={{ textAlign: 'left', minHeight: '20px', marginTop: '2px' }}
    />)
  }
  if (!values.country || !values.country.trim()) {
    errors.country = <Error errorText="Required" />
  }
  if (!values.phone || !values.phone.trim()) {
    errors.phone = <Error errorText="Required" />
  } else if (!isValidTel(values.phone)) {
    errors.phone = <Error errorText="Only numbers allowed" />
  }
  if ((values.country === 'CA' || values.country === 'US') && (!values.state || !values.state.trim())) {
    errors.state = <Error errorText="Required" />
  }
  return errors
}

/*
 * @function renderTextField returns the text fields
 */
const renderTextField = (field) => {
  const { input, hintText, type, label, meta: { submitFailed, error }, ...custom } = field
  return (
    <TextField
      type={type}
      floatingLabelText={label}
      hintText={hintText}
      hintStyle={{ color: styleVariables.mediumGrey }}
      floatingLabelStyle={{ color: styleVariables.mediumGrey }}
      errorText={submitFailed && error}
      errorStyle={{ position: 'absolute', width: '100%', bottom: '0px' }}
      fullWidth
      {...input}
      {...custom}
    />
  )
}

const renderSelectField = (field) => {
  const { id, input, hintText, options, label, meta: { submitFailed, error } } = field
  return (
    <div style={{ height: 87, overflow: 'hidden' }}>
      <SelectField
        id={id}
        floatingLabelText={label}
        maxHeight={170}
        hintText={hintText}
        iconStyle={{ width: '34px', height: '34px' }}
        hintStyle={{ color: styleVariables.mediumGrey }}
        floatingLabelStyle={{ color: styleVariables.mediumGrey }}
        errorText={submitFailed && error}
        errorStyle={{ position: 'absolute', width: '100%', bottom: '0px' }}
        fullWidth
        {...input}
        onChange={(event, index, value) => setTimeout(() => input.onChange(value), 10)}
      >
        {
          options.map((value) => {
            const key = Object.keys(value)[0]
            const keyValue = value[key]
            return <MenuItem value={keyValue} primaryText={key} key={key} />
          })
        }
      </SelectField>
    </div>
  )
}

const renderRadioGroup = ({ input, text, meta, ...rest }) => {
  return (
    <div>
      <span>{text}</span>
      <div style={{ marginTop: '15px' }}>
        <div>
          <RadioButtonGroup
            {...input}
            {...rest}
            className="clearfix radioGroupBasicInfo"
            labelPosition="left"
            valueSelected={input.value}
            errorText={meta.submitFailed && meta.error}
            errorStyle={{ position: 'absolute', width: '100%', bottom: '0px' }}
            onChange={(event, value) => input.onChange(value)}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%' }}>
              {(meta.submitFailed && meta.error)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderCheckBox = ({ input, meta, label }) => {
  const True = true
  return (
    <div>
      <div className="checkboxContainerBasicInfo">
        <CheckBox
          checked={input.value ? True : false}
          inputStyle={{ width: '20px', marginRight: '16px', marginLeft: '0px', height: '20px', left: 'none' }}
          label={label}
          onCheck={(response, isChecked) => input.onChange(isChecked)}
          labelStyle={{ color: styleVariables.darkGrey, fontSize: '14px', lineHeight: '-0.1px' }}
          style={{ backgroundColor: styleVariables.background, padding: '15px', marginTop: '35px' }}
        />
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
          {(meta.submitFailed && meta.error)}
        </div>
      </div>
    </div>
  )
}

/*
* @function submitForm gets the form details,
* make the payload and calls the corresponding actions
* @param {object} formValues stores the values for form fields
*/
function submitForm(formValues, dispatch) {
  const details = formValues
  return new Promise((resolve, reject) => {
    if (details.country !== 'CA' && details.country !== 'US') {
      delete details.state
    }
    dispatch(doCompleteRegister(details, (err) => {
      // server side validation to be updated
      if (err)
        return reject(new SubmissionError({
          firstName: err.firstName && <Error errorText={err.firstName} />,
          lastName: err.lastName && <Error errorText={err.lastName} />,
          tos_accepted: err.tosAccepted && <Error errorText={err.tosAccepted} />
        }));
      resolve()
    }))
  })
}

class BasicInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }
    this._toggleModal = this._toggleModal.bind(this)
  }

  _toggleModal() {
    const { modalOpen } = this.state
    this.setState({ modalOpen: !modalOpen, termsAccepted: false })
  }

  /*
   * @function render
   * @returns the html for the BasicInfo component
   * @memberOf BasicInfo
   */
  render() {
    const True = true
    const { handleSubmit, isRegistering, country } = this.props
    const { modalOpen } = this.state
    return (
      <Row>
        <Modal
          toggleModal={this._toggleModal}
          title={'Communications'}
          open={modalOpen}
          autoScrollBodyContent={false}
          titleStyle={{ fontFamily: 'proxima_novaLight', fontWeight: '600', letterSpacing: '0.8px' }}
          style={{ maxWidth: '445px' }}
          childrenStyle={{ paddingLeft: '26px' }}
          iconName="x-grey-icon"
        >
          <ReadMore />
        </Modal>
        <Col md={1} />
        <Col md={4} xs={12} className="contentWrap" >
          <div className="heading">
            Basic Information
          </div>
          <div className="description">
            Welcome! Please complete the following pages so that we can get to know you better.
          </div>
          <form id="BasicInfoForm" onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} sm={6} md={12} className="contentFieldLeft" >
                <Field name="firstName" component={renderTextField} label="First Name" />
              </Col>
              <Col xs={12} sm={6} md={12} className="contentFieldRight" >
                <Field name="lastName" component={renderTextField} label="Last Name" />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={12} className="contentFieldLeft" >
                <Field name="phone" component={renderTextField} label="Phone Number" />
              </Col>
              <Col xs={12} sm={6} md={12} className="contentFieldRight" >
                <Field
                  id="CountryBasicInfo"
                  name="country"
                  label="Country"
                  component={renderSelectField}
                  options={Countries}
                />
              </Col>
              {
                (country === 'CA' || country === 'US') &&
                <Col xs={12} sm={6} md={12} style={{ marginTop: '-15px' }} className="contentFieldLeft" >
                  <Field
                    id="ProvinceBasicInfo"
                    name="state"
                    label="State/Province"
                    component={renderSelectField}
                    options={country === 'CA' ? CanadaProvinces : UsStates}
                  />
                </Col>
              }
              <Col xs={12} sm={6} md={12} className="contentFieldRight" >
                <div style={{ marginTop: '28px' }} id="currentMuserRadio">
                  <Field text="Are you currently using Muse?" name="currentMuser" component={renderRadioGroup} >
                    <RadioButton iconStyle={{ marginLeft: '15px' }} style={{ display: 'inline-block', width: '50%' }} value={True} label="Yes" />
                    <RadioButton iconStyle={{ marginLeft: '12px' }} style={{ display: 'inline-block', width: '50%' }} value={false} label="No" />
                  </Field>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div style={{ paddingTop: '10px' }} id={'tosAccepted'}>
                  <Field name="tosAccepted" component={renderCheckBox} label={tosLabel} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Field
                  name="emailOptIn"
                  component={renderCheckBox}
                  label={<div id="emailOptIn">I would like to stay informed about the latest news, product updates and exclusive offers from Muse. <span className="emailOptInOptional">(optional)</span><br /><span onClick={this._toggleModal} className="hyperLink"> Read more about email communications</span>.</div>}
                />
              </Col>
            </Row>
            <div style={{ paddingTop: '20px', paddingBottom: '50px' }}>
              <div className="actionButton">
                <RaisedButton
                  type="submit"
                  disabled={isRegistering}
                  label={isRegistering ? <CircularProgress size={30} color={styleVariables.mediumGrey} innerStyle={{ verticalAlign: 'middle' }} /> : 'Save and continue'}
                  style={{
                    minWidth: '185px',
                    borderRadius: '10px'
                  }}
                  buttonStyle={{ borderRadius: '10px' }}
                  labelStyle={{ letterSpacing: '.8px' }}
                  primary={True}
                />
              </div>
            </div>
          </form>
        </Col>
        <Col md={1} />
        <Col md={6} sm={12} className="sideImageBasicInfo" />
      </Row>
    )
  }
}

BasicInformation.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isRegistering: PropTypes.bool.isRequired,
}

// Decorate with connect to read form values
const selector = formValueSelector('BasicInformation') // <-- same as form name

function mapStateToProps(state) {
  const { basicInfo: { isRegistering }, user } = state;
  const userInfo = user && user.info
  const country = selector(state, 'country')
  return {
    isRegistering,
    country,
    initialValues: {
      firstName: (userInfo && userInfo.firstName) || undefined,
      lastName: (userInfo && userInfo.lastName) || undefined,
      phone: (userInfo && userInfo.phone) || undefined,
      tosAccepted: (userInfo && userInfo.tosAccepted) || undefined,
      currentMuser: ((userInfo && userInfo.currentMuser) ||
        (userInfo && userInfo.currentMuser === false))
        ? userInfo.currentMuser : 0, // update when this field is not mandatory
      emailOptIn: (userInfo && userInfo.emailOptIn) || undefined,
      country: (userInfo && userInfo.country) || undefined,
      state: (userInfo && userInfo.state) || undefined,
    }
  }
}

/**
 * @functionCall connect binds the component with redux store state
 */
export default connect(mapStateToProps)(reduxForm({
  form: 'BasicInformation',
  validate,
  onSubmit: submitForm
})(BasicInformation))
