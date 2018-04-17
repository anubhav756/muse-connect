import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { TextField, RaisedButton, CircularProgress } from 'material-ui'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import Modal from '../Modal'
import { MOBILE_VIEW } from '../../libs/helpers/windowDimension'
import { cleverTapSaveNote } from '../../libs/cleverTap'
import './AddEditNoteModal.scss'

export default class AddEditNoteModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      title: props.title,
      createdAt: props.createdAt,
      content: props.content,
      id: props.id,
      clientID: props.clientId,
      contentType: 'text/plain'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.isInvalid = this.isInvalid.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidUpdate() {
    const { open } = this.state
    if (!open) {
      // tells parent to remove modal from DOM
      // timeout is used so that fade away Modal can take affect on closing Modal
      setTimeout(() =>
        this.props.toggleModal()
      , 100)
    }
  }

  closeModal() {
    this.setState({ open: false })
  }

  isInvalid() {
    const { title, content } = this.state
    if (!title.trim() || !content.trim()) {
      return true
    }
    return false
  }

  handleChange(text, key) {
    this.setState({ [key]: text })
  }

  handleSave(details = {}) {
    const payload = Object.assign({}, details)
    const { editNote, clientId } = this.props;
    delete payload.open
    cleverTapSaveNote()
    if (editNote) {
      this.props.updateNote(payload, () => {
        this.closeModal()
      })
    } else {
      this.props.addNote(clientId, payload, () => {
        this.closeModal()
      })
    }
  }

  render() {
    const { editNote, wd, disabled } = this.props
    const { open } = this.state
    const { title, content } = this.state
    const isMobile = MOBILE_VIEW(wd)
    return (
      <div>
        <Modal
          open={open}
          toggleModal={this.closeModal}
          title={editNote ? 'Edit Note' : 'Add Note'}
          childrenStyle={isMobile ? { color: colors.darkGrey, paddingLeft: '26px', paddingRight: '26px', marginRight: '0px' } : { color: colors.darkGrey }}
          titleStyle={isMobile ? { paddingLeft: '26px' } : {}}
          modal
        >
          <div>
            <div>
              <div className="titleFieldWrapAddEditNoteModal">
                <TextField
                  hintText="Title"
                  maxLength={100}
                  name="TitleAddEditNoteModal"
                  underlineShow={false}
                  style={{ height: '36px' }}
                  hintStyle={{ bottom: '7px' }}
                  onChange={(e) => { this.handleChange(e.target.value, 'title') }}
                  value={title}
                  fullWidth
                />
              </div>
            </div>
            <div className="contentFieldWrapAddEditNoteModal">
              <TextField
                fullWidth
                hintText="Note content"
                name="ContentAddEditNoteModal"
                multiLine
                rows={8}
                rowsMax={8}
                underlineShow={false}
                hintStyle={{ bottom: 'auto', top: '12px' }}
                onChange={(e) => { this.handleChange(e.target.value, 'content') }}
                value={content}
                maxLength={2000}
              />
            </div>
            <div className="desclaimerAddEditNoteModal">
              <i>
                *Do not enter any medical or personal health information about the client in the note.
                 See Muse Connect
                <Link
                  target="_blank"
                  href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf"
                  className="hyperLink"
                >
                  &nbsp;Terms of Service&nbsp;
                </Link>
                for more information.
              </i>
            </div>
            <div className="footerWrapAddEditNoteModal clearfix">
              <div className="remChWrapAddEditNoteModal">
                Characters remaining:
                <span className="remChTxtAddEditNoteModal"> {2000 - content.length}</span>
              </div>
              <div className="actionButtonAddEditNoteModal">
                <RaisedButton
                  style={{ marginLeft: isMobile ? '5px' : '10px', borderRadius: '10px' }}
                  buttonStyle={{ borderRadius: '10px' }}
                  overlayStyle={{ borderRadius: '10px' }}
                  label={disabled ? <CircularProgress size={20} color={colors.mediumGrey} innerStyle={{ verticalAlign: 'middle' }} /> : 'Save'}
                  disabled={this.isInvalid() || disabled}
                  onClick={() => this.handleSave(this.state)}
                  primary
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

AddEditNoteModal.propTypes = {
  editNote: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  wd: PropTypes.object.isRequired,
  clientId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  createdAt: PropTypes.string,
  id: PropTypes.string,
  updateNote: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired
}

AddEditNoteModal.defaultProps = {
  editNote: false,
  title: '',
  content: '',
  createdAt: new Date().toISOString(),
  id: ''
}
