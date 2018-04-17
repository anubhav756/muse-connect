import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { FlatButton } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles'
import AddEditNote from 'components/AddEditNote'
import AddEditNoteModal from 'components/AddEditNote/AddEditNoteModal'
import getStore from '../../../__mocks__/mockStore'

const mockStore = getStore()

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const props = {
  component: <FlatButton label="Add note" />,
  wd: {
    innerWidth: 1100
  },
  clientId: 'abc124',
  addNote: () => {},
  updateNote: () => {}
}
describe('(Component) AddEditNote', () => {
  const store = mockStore()
  let contextRef = getContext(store)
  let wrapper = null

  const buildWrapper = () => (
    mount(<AddEditNote {...props} />, {
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
  it('component passed in props should render', () => {
    wrapper.find(FlatButton).should.have.length(1)
  })
  it('AddEditModal component should not exist', () => {
    wrapper.find(AddEditNoteModal).should.have.length(0)
  })
  it('Should render AddEditNoteModal on click event of wrapper div of passed component', () => {
    wrapper.find('[role="button"]').getElement().props.onClick()
    wrapper.update()
    wrapper.find(AddEditNoteModal).should.have.length(1)
    wrapper.state().openModal.should.be.true()
  })
})
