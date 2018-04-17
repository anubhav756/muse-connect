import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton } from 'material-ui'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import Error from '../Error';
import Modal from '../Modal';
import styles from './styles';

const mobileTitleStyle = { fontFamily: 'proxima_novasemibold', color: colors.darkGrey, fontSize: '20px', paddingLeft: '20px', paddingRight: '40px', lineHeight: '26px' }
const titleStyle = { fontFamily: 'proxima_novasemibold', color: colors.darkGrey, fontSize: '26px', paddingLeft: '42px', paddingRight: '42px', lineHeight: '32px' }

function validate(values) {
  const errors = {};

  if (!values.email || !values.email.trim())
    errors.email = 'Required';
  else
    values.email.split(',').forEach((email) => {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.trim()))
        errors.email = 'Invalid email address';
    });

  return errors;
}

function renderEmailField(field) {
  const { input, meta: { error, submitFailed }, ...rest } = field;
  return (
    <div>
      <input
        type="text"
        id="addClientInputField"
        placeholder="Enter the email address of your clients"
        style={styles.input}
        {...input}
        {...rest}
      />
      {
        submitFailed && error &&
        <Error errorText={error} style={{ color: 'red', fontSize: 14, marginTop: 2 }} />
      }
    </div>
  );
}

class AddClientModal extends React.Component {
  submitForm = ({ email }) => {
    const { addClient, reset, toggleModal } = this.props;
    return new Promise((resolve, reject) => {
      addClient(email, (err) => {
        if (err)
          reject(new SubmissionError({ email: 'Email submission error' }))
        else {
          resolve();
          reset();
          toggleModal();
        }
      });
    })
  }

  render() {
    const {
      addingClient,
      handleSubmit,
      isMobile,
      toggleModal,
      open
    } = this.props;

    return (
      <Modal
        open={open}
        title="Invite Client(s)"
        subTitle="Separate each email address with a comma"
        titleStyle={isMobile ? mobileTitleStyle : titleStyle}
        iconName="x-grey-icon"
        style={styles.container}
        toggleModal={toggleModal}
        autoScrollBodyContent={false}
        childrenStyle={{ paddingLeft: isMobile ? '20px' : '42px', paddingRight: isMobile ? '20px' : '42px', overflowY: 'auto' }}
        childrenClassName="contentAddClient"
        actions={[
          <RaisedButton
            label={addingClient ? 'Please wait...' : 'Send Request'}
            disabled={addingClient}
            labelStyle={styles.labelStyle}
            primary
            buttonStyle={{ borderRadius: '10px' }}
            overlayStyle={{ borderRadius: '10px' }}
            onClick={handleSubmit(this.submitForm)}
            style={{ marginRight: isMobile ? '20px' : '34px', marginBottom: 20, borderRadius: '10px' }}
          />
        ]}
      >
        <form id="addClient" onSubmit={handleSubmit(this.submitForm)}>
          <Field name="email" component={renderEmailField} />
        </form>
        <div style={styles.description}>
          To add your clients to Muse Connect, enter their email address above. If your client is new to Muse, they will receive an email to download the Muse app and to create an account. They will receive another email invitation to share their data with you after they have created a Muse account. Once your request is accepted, their session data will appear on your dashboard.
        </div>
      </Modal>
    )
  }
}

AddClientModal.propTypes = {
  addingClient: PropTypes.bool.isRequired,
  addClient: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'addClient',
  validate,
  destroyOnUnmount: true
})(AddClientModal);
