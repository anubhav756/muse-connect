import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Snackbar from 'material-ui/Snackbar'

import { closeNotice } from '../../redux/modules/notice'
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
        message={<div dangerouslySetInnerHTML={{ __html: message }} />}
        action="dismiss"
        className={'noticeView'}
        bodyStyle={{ height: 'auto', lineHeight: 'auto', paddingBottom: '10px' }}
        onActionClick={this.handleRequestClose}
        onRequestClose={this.handleRequestClose}
        style={{ zIndex: 99999 }}
      />
    );
  }
}

Notice.propTypes = {
  closeNotice: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired
}

function mapStateToProps({ notification }) {
  return { notification }
}

export default connect(mapStateToProps, { closeNotice })(Notice)
