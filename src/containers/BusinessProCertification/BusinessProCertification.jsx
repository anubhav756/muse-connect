import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss';

import Error from '../../components/Error';
import CheckBox from '../../components/CheckBox';
import CertificationModal from './CertificationModal';
import { Professions } from '../../libs/constants/profession'
import { businessTypes } from '../../libs/constants/businessType'
import { addCertification } from '../../redux/modules/certification';
import './BusinessProCertification.scss';

// stores validation rules for fields
const validate = (values) => {
  const errors = {}
  if (!values.certificationBody || !values.certificationBody.trim()) {
    errors.certificationBody = <Error errorText="Required" />
  }
  if (!values.businessType || !values.businessType.trim()) {
    errors.businessType = <Error errorText="Required" />
  }
  if (!values.businessName || !values.businessName.trim()) {
    errors.businessName = <Error errorText="Required" />
  }
  if (!values.eligiblePro) {
    errors.eligiblePro = (<Error
      textStyle={{ fontSize: '12px', color: styleVariables.red }}
      errorText="Required"
      style={{ textAlign: 'left', minHeight: '20px', marginTop: '2px' }}
    />)
  }
  return errors
}

const renderSelectField = (field) => {
  const { id, input, hintText, options, label, meta: { submitFailed, error } } = field
  return (
    <div style={{ height: 72, overflow: 'hidden' }}>
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
        onChange={(event, index, value) => input.onChange(value)}
        style={{ marginTop: '-15px' }}
      >
        {
          options.map(value => <MenuItem value={value} primaryText={value} key={value} />)
        }
      </SelectField>
    </div>
  )
}
/*
 * @function renderTextField returns the text fields
 */
const renderTextField = (field) => {
  const { id, input, hintText, type, label, meta: { submitFailed, error } } = field
  return (
    <div style={{ height: 72, overflow: 'hidden' }}>
      <TextField
        id={id}
        type={type}
        floatingLabelText={label}
        hintText={hintText}
        hintStyle={{ color: styleVariables.mediumGrey }}
        floatingLabelStyle={{ color: styleVariables.mediumGrey }}
        errorText={submitFailed && error}
        errorStyle={{ position: 'absolute', width: '100%', bottom: '0px' }}
        fullWidth
        {...input}
        style={{ marginTop: '-15px' }}
      />
    </div>
  )
}

function renderCheckbox(field) {
  const { meta, input } = field;
  const True = true
  return (
    <div>
      <div className="checkboxContainerBProCertification">
        <CheckBox
          inputStyle={{ width: '20px', marginRight: '16px', marginLeft: '0px', height: '20px', left: 'none' }}
          checked={input.value ? True : false}
          label={<div>I am a qualified professional and meet the eligibility requirements.<br /><span onClick={this.toggleModal} className="hyperLink checkEligibility">Check eligibility requirements</span>.</div>}
          onCheck={(response, isChecked) => input.onChange(isChecked)}
          labelStyle={{ color: styleVariables.darkGrey, fontSize: '14px', lineHeight: '-0.1px' }}
          style={{ backgroundColor: styleVariables.background, padding: '15px', marginTop: '15px' }}
        />
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
          {(meta.submitFailed && meta.error)}
        </div>
      </div>
    </div>
  );
}

/*
 * @function submitForm gets the form details,
 * make the payload and calls the corresponding actions
 * @param {object} details stores the values for form fields
 */
function submitForm(details, dispatch) {
  // submit signin details
  return new Promise((resolve, reject) => {
    dispatch(addCertification(details, (err) => {
      // handles server side validation
      // server side validation to be updated
      if (err)
        reject(new SubmissionError({
          eligiblePro: err.eligiblePro && <Error errorText={err.eligiblePro} />,
          certificationNum: (
            err.certificationNum &&
            <Error errorText={err.certificationNum} />
          ),
          certificationBody: err.certificationBody && <Error errorText={err.certificationBody} />,
          businessName: err.businessName && <Error errorText={err.businessName} />,
          businessType: err.businessType && <Error errorText={err.businessType} />
        }));
      else
        resolve();
    }));
  });
}

class BProCertification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.renderCheckbox = renderCheckbox.bind(this)
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }
  /*
   * @function render
   * @returns the html for the SignIn component
   * @memberOf SignIn
   */
  render() {
    const { handleSubmit, isFetching } = this.props
    return (
      <Row>
        <CertificationModal showModal={this.state.showModal} toggleModal={this.toggleModal} />
        <Col md={1} />
        <Col md={4} xs={12} className="contentWrapBProCertification">
          <div className="heading">
            Business and Profession
          </div>
          <form onSubmit={handleSubmit}>
            <Row className="stepBProCertification">
              <Col xs={12}>
                <Field
                  id="businessType-BProCertification"
                  name="businessType"
                  label="Business Type"
                  component={renderSelectField}
                  options={businessTypes}
                />
              </Col>
            </Row>
            <Row className="stepBProCertification">
              <Col xs={12}>
                <Field id="businessName-BProCertification" name="businessName" component={renderTextField} label="Business Name" />
              </Col>
            </Row>
            <Row className="stepBProCertification">
              <Col xs={12}>
                <Field
                  id="certifyingBody-BProCertification"
                  name="certificationBody"
                  label="Profession"
                  component={renderSelectField}
                  options={Professions}
                />
              </Col>
            </Row>
            <Row className="stepBProCertification">
              <Col xs={12}>
                <Field id="certificationNumber-BProCertification" name="certificationNum" component={renderTextField} label="Certifying/License Number (optional)" />
              </Col>
            </Row>
            <Row className="stepBProCertification">
              <Col xs={12}>
                <Field id="agree-BProCertification" name="eligiblePro" component={this.renderCheckbox} />
              </Col>
            </Row>
            <div className="actionButtonBProCertification">
              <RaisedButton
                type="submit"
                disabled={isFetching}
                label={
                  isFetching ?
                    <CircularProgress size={30} color={styleVariables.mediumGrey} innerStyle={{ verticalAlign: 'middle' }} /> :
                    'SAVE AND CONTINUE'
                }
                style={{
                  minWidth: '185px',
                  marginBottom: '100px',
                  borderRadius: '10px'
                }}
                buttonStyle={{ borderRadius: '10px' }}
                labelStyle={{ letterSpacing: '.8px' }}
                primary
              />
            </div>
          </form>
        </Col>
        <Col md={1} />
        <Col md={6} sm={12} className="sideImageBProCertification" />
      </Row >
    )
  }
}

BProCertification.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { certification: { isFetching }, user } = state;
  const userInfo = user && user.info
  return {
    isFetching,
    initialValues: {
      businessType: (userInfo && userInfo.businessType) || undefined,
      businessName: (userInfo && userInfo.businessName) || undefined,
      certificationNum: (userInfo && userInfo.certificationNum) || undefined,
      eligiblePro: (userInfo && userInfo.eligiblePro) || undefined,
      certificationBody: (userInfo && userInfo.certificationBody) || undefined
    }
  }
}

/**
 * @functionCall connect binds the component with redux store state
 */
export default connect(mapStateToProps)(reduxForm({
  form: 'BProCertification',
  validate,
  onSubmit: submitForm
})(BProCertification))
