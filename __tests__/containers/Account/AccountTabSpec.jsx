import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'
import AccountComponent from '../../../src/containers/Account/Widgets/Account'
import { user } from '../../../__mocks__/fixtures.json'
import EditableLabel from '../../../src/components/EditableLabel'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  user,
  windowDimension: {
    innerWidth: 768
  }
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) Account Setting Account tab', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<AccountComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  describe('', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('should render 5 Editable labels', () => {
      wrapper.find(EditableLabel).should.have.length(5)
    })
    it('should call onChange function of EditableLabel elements', () => {
      wrapper.find(EditableLabel).at(0).getElement().props.onChange('Jasna Todrovic')
      wrapper.find(EditableLabel).at(1).getElement().props.onChange('jasna@interaxon.ca')
      wrapper.find(EditableLabel).at(3).getElement().props.onChange('jasna')
      wrapper.find(EditableLabel).at(4).getElement().props.onChange('jasna@interaxon.ca')
    })
  })
})
