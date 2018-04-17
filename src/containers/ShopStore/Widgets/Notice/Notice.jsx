import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Snackbar from 'material-ui/Snackbar'

import { closeNotice } from '../../reduxModule/shopStoreNotice'
import './Notice.scss'

export class Notice extends Component {

  constructor(props) {
    super(props)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleRequestClose() {
    this.props.closeNotice()
  }

  render() {
    const { notification: { open, message } } = this.props
    return (
      <Snackbar
        open={open}
        className={'noticeView'}
        bodyStyle={{ height: 'auto', lineHeight: 'auto', paddingBottom: '10px' }}
        message={message}
        action="dismiss"
        onRequestClose={this.handleRequestClose}
        style={{ zIndex: 10000 }}
      />
    );
  }
}

Notice.propTypes = {
  closeNotice: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired
}

function mapStateToProps({ shopStoreNotice }) {
  return { notification: shopStoreNotice }
}

export default connect(mapStateToProps, { closeNotice })(Notice)
