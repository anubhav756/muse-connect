import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddEditNoteModal from './AddEditNoteModal'
import { cleverTapAddNote, cleverTapEditNote } from '../../libs/cleverTap'

export default class AddEditNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
    this.toggleModal = this.toggleModal.bind(this)
    this.handleToggleEvent = this.handleToggleEvent.bind(this)
  }

  toggleModal() {
    const { openModal } = this.state
    if (!openModal && this.props.editNote) {
      cleverTapEditNote()
    } else if (!openModal) {
      cleverTapAddNote()
    }
    this.setState({
      openModal: !openModal
    })
  }

  handleToggleEvent(doToggle) {
    if (doToggle)
      this.toggleModal()
  }
  render() {
    const { openModal } = this.state
    const { component, ...otherProps } = this.props
    const { disabled } = otherProps
    return (
      <div style={{ display: 'inline-block' }}>
        <div
          role="button"
          tabIndex="0"
          onClick={() => this.handleToggleEvent(!disabled)}
          onKeyUp={e => (e.keyCode === 13) && this.handleToggleEvent(!disabled)}
        >
          {component}
        </div>
        <div>
          {
            openModal &&
            <AddEditNoteModal
              open={openModal}
              toggleModal={this.toggleModal}
              {...otherProps}
            />
          }
        </div>
      </div>
    )
  }
}

AddEditNote.propTypes = {
  component: PropTypes.object.isRequired,
  editNote: PropTypes.bool,
  disabled: PropTypes.bool
}

AddEditNote.defaultProps = {
  editNote: false,
  disabled: false
}
