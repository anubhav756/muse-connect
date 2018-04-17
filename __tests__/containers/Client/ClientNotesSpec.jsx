import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import Loader from 'components/Loader/ContentLoader';
import NoResultFound from 'components/NoResultFoundCard'
import AddEditNote from 'components/AddEditNote'
import { initialState as notesInitialState } from 'redux/modules/notes'
import { getMuiTheme } from 'material-ui/styles'
import NoteAdd from 'material-ui/svg-icons/action/note-add';
import ClientNotes from 'containers/Client/ClientNotes'
import ClientNoteItem from 'components/ClientNoteItem'
import getStore from '../../../__mocks__/mockStore'


const mockStore = getStore()

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const Props = {
  clientId: 'abc124'
}

describe('(View client) notes', () => {
  let store = mockStore()
  let contextRef = getContext(store)
  let wrapper = null

  const buildWrapper = () => (
    mount(<ClientNotes {...Props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  beforeAll(() => {
    contextRef = getContext(store)
    wrapper = buildWrapper()
  })
  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  describe('notes are fetching', () => {
    beforeAll(() => {
      store = mockStore({ notes: { ...notesInitialState, isFetching: true } })
      contextRef = getContext(store)
      wrapper = buildWrapper()
    })
    it('should render loader as notes are fetching', () => {
      wrapper.find(Loader).should.have.length(1)
    })
  })
  describe('Error occured during notes fetching', () => {
    beforeAll(() => {
      store = mockStore({ notes: { ...notesInitialState, isError: true } })
      contextRef = getContext(store)
      wrapper = buildWrapper()
    })
    it('should render Error component', () => {
      wrapper.find(NoResultFound).should.have.length(1)
    })
  })
  describe('Notes has been fetched successfully', () => {
    beforeAll(() => {
      store = mockStore()
      contextRef = getContext(store)
      wrapper = buildWrapper()
    })
    it('should render ClientNoteItem', (done) => {
      const unsubscribe = store.subscribe(() => {
        if (store.getState().notes.isFetching === false) {
          wrapper.update()
          wrapper.find(ClientNoteItem).should.have.length(3)
          unsubscribe()
          done()
        }
      })
    })
    it('should render AddEditNote component', () => {
      wrapper.find(AddEditNote).at(0).find(NoteAdd).should.have.length(1)
    })
    it('should update ClientNoteItem when update is called over ClientNoteItem', (done) => {
      const { id,
        contentType,
        createdAt,
        clientId,
        updateNote } = wrapper.find(ClientNoteItem).at(0).getElement().props
      updateNote({
        id,
        contentType,
        createdAt,
        clientId,
        title: 'Updated title',
        content: 'Updated content'
      })
      const unsubscribe = store.subscribe(() => {
        if (store.getState().notes.isAction === false) {
          wrapper.update()
          const { title, content } = wrapper.find(ClientNoteItem).at(0).getElement().props
          title.should.equal('Updated title')
          content.should.equal('Updated content')
          unsubscribe()
          done()
        }
      })
    })
    it('should remove ClientNoteItem when delete is clicked over ClientNoteItem', (done) => {
      const { id, deleteNote } = wrapper.find(ClientNoteItem).at(0).getElement().props
      deleteNote(id)
      const unsubscribe = store.subscribe(() => {
        if (store.getState().notes.isAction === false) {
          wrapper.update()
          wrapper.find(ClientNoteItem).should.have.length(2)
          unsubscribe()
          done()
        }
      })
    })
  })
})
