import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { addClient as _addClient } from '../../redux/modules/clientList'
import { MOBILE_VIEW } from '../../libs/helpers/windowDimension'
import AddClientModal from './AddClientModal'
import './AddClient.scss'

class AddClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: '',
      error: null
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal() {
    this.setState({
      open: !this.state.open
    }, () => {
      if (this.state.open) {
        setTimeout(() => {
          document.getElementById('addClientInputField').focus()
        })
      }
    });
  }

  render() {
    const {
      style,
      clientList: {
        addingClient
      },
      show,
      iconStyle,
      zDepth,
      windowDimension,
      mini,
      addClient
    } = this.props;
    const { open } = this.state
    const isMobile = MOBILE_VIEW(windowDimension)
    return (
      <div>
        {
          show &&
          <FloatingActionButton
            onClick={this.toggleModal}
            style={style}
            zDepth={zDepth}
            mini={mini}
          >
            <ContentAdd style={iconStyle} />
          </FloatingActionButton>
        }
        {
          open &&
          <AddClientModal
            open={open}
            toggleModal={this.toggleModal}
            isMobile={isMobile}
            addingClient={addingClient}
            addClient={addClient}
          />
        }
      </div>
    );
  }
}
AddClient.propTypes = {
  style: PropTypes.object,
  clientList: PropTypes.object.isRequired,
  addClient: PropTypes.func.isRequired,
  show: PropTypes.bool,
  iconStyle: PropTypes.object,
  zDepth: PropTypes.number,
  mini: PropTypes.bool,
  windowDimension: PropTypes.object.isRequired
}
AddClient.defaultProps = {
  style: null,
  show: true,
  iconStyle: {},
  zDepth: 1,
  mini: false
}

export default connect(
  ({ clientList, windowDimension }) => ({ clientList, windowDimension }),
  { addClient: _addClient }
)(AddClient);
