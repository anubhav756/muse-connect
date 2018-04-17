import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './styles';

function TextLinkField(props) {
  return (
    <div style={{ ...styles.fieldContainer, ...props.style }}>
      {props.renderComponent()}
      {
        !props.hideLink &&
        <Link
          className="exceptMobile"
          to={props.linkTo}
          style={{ ...styles.hyperLink, ...styles.linkTextInline, ...props.linkTextInlineStyle }}
          onClick={props.onClick}
        >
          {props.linkText}
        </Link>
      }
      <Link
        className="mobileOnly"
        to={props.linkTo}
        style={{ ...styles.hyperLink, ...styles.linkText, ...props.linkTextStyle }}
        onClick={props.onClick}
      >
        {props.linkText}
      </Link>
    </div>
  );
}
TextLinkField.propTypes = {
  renderComponent: PropTypes.func.isRequired,
  hideLink: PropTypes.bool,
  linkText: PropTypes.string.isRequired,
  linkTo: PropTypes.string,
  onClick: PropTypes.func,
  linkTextStyle: PropTypes.object,
  linkTextInlineStyle: PropTypes.object,
  style: PropTypes.object
}
TextLinkField.defaultProps = {
  hideLink: false,
  linkTo: null,
  onClick: null,
  linkTextStyle: null,
  linkTextInlineStyle: null,
  style: null
}

export default connect(({ windowDimension }) => ({ windowDimension }))(TextLinkField);
