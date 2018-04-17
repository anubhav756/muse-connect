import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'
import { TextField, RaisedButton } from 'material-ui';
import Modal from 'components/Modal'
import { getMuiTheme } from 'material-ui/styles'
import AddEditNoteModal from 'components/AddEditNote/AddEditNoteModal'
import getStore from '../../../__mocks__/mockStore'
import fixture from '../../../__mocks__/fixtures.json'

const mockStore = getStore()

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const addProps = {
  toggleModal: sinon.spy(),
  wd: {
    innerWidth: 1100
  },
  clientId: 'abc124',
  disabled: false,
  addNote: sinon.spy(),
  updateNote: sinon.spy(),
}

const note = fixture.notes[0]

const editProps = {
  ...addProps,
  toggleModal: sinon.spy(),
  editNote: true,
  title: note.title,
  content: note.content,
  id: note.id,
  createdAt: note.createdAt,
}

describe('(Component) AddEditNote', () => {
  const store = mockStore()
  let contextRef = getContext(store)
  let wrapper = null

  const buildWrapper = props => (
    shallow(<AddEditNoteModal {...props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      },
      lifecycleExperimental: true
    })
  )

  beforeAll(() => {
    contextRef = getContext(store)
    wrapper = buildWrapper(addProps)
  })
  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  it('should render two text fields', () => {
    wrapper.find(TextField).should.have.length(2)
  })
  it('should render save button', () => {
    wrapper.find(RaisedButton).should.have.length(1)
  })
  it('rendered save button should be disabled', () => {
    wrapper.find(RaisedButton).getElement().props.disabled.should.be.true()
  })
  it('click on Cross icon should execute toggleModal', () => {
    wrapper.find(Modal).getElement().props.toggleModal()
    wrapper.state().open.should.be.false()
  })
  it('rendered save button should be enabled as title and content is typed in fields', () => {
    wrapper.setState({ title: 'Note title', content: 'Note content' })
    wrapper.find(RaisedButton).getElement().props.disabled.should.be.false()
  })
  it('should call addNote prop method as save button is clicked', () => {
    wrapper.find(RaisedButton).getElement().props.onClick()
    addProps.addNote.should.be.called()
  })
  it('click on Cross icon should execute toggleModal', () => {
    wrapper.find(Modal).getElement().props.toggleModal()
    wrapper.state().open.should.be.false()
  })

  describe('Edit modal', () => {
    beforeAll(() => {
      wrapper = buildWrapper(editProps)
    })
    it('Title should have been set to {note.title}', () => {
      wrapper.find(TextField).at(0).getElement().props.value.should.equal(note.title)
    })
    it('Title should have been set to {note.content}', () => {
      wrapper.find(TextField).at(1).getElement().props.value.should.equal(note.content)
    })
    it('rendered save button should be enabled', () => {
      wrapper.find(RaisedButton).getElement().props.disabled.should.be.false()
    })
    it('should call updateNote prop method as save button is clicked', () => {
      wrapper.find(RaisedButton).getElement().props.onClick()
      editProps.updateNote.should.be.called()
    })
    it('rendered save button should get disabled if any of text field get empty', () => {
      wrapper.setState({ title: '' })
      wrapper.find(RaisedButton).getElement().props.disabled.should.be.true()
    })
    it('click on  should execute toggleModal', () => {
      wrapper.find(Modal).getElement().props.toggleModal()
      wrapper.state().open.should.be.false()
    })
  })
})
