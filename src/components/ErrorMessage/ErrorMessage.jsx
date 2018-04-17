import React from 'react';
import PropTypes from 'prop-types';
import './ErrorMessage.scss';

function ErrorMessage({ message }) {
  return (
    <center className="ContainerErrorMessage">
      {message}<br />
      {'Please'} <a className="hyperLinkErrorMessage" onClick={() => location.reload()}>reload</a> {'the page'}
    </center>
  );
}
ErrorMessage.propTypes = {
  message: PropTypes.string
}
ErrorMessage.defaultProps = {
  message: 'An unexpected error occurred.'
}

export default ErrorMessage;
