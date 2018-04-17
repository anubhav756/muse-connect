import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import 'should-sinon'
import sinon from 'sinon'
import { getMuiTheme } from 'material-ui/styles'
import IconMenu from 'material-ui/IconMenu'

import ClientListActions from '../../../src/components/ActionsDropDown/ClientListActions'

const callBackSpy = sinon.spy()

const props = {
  label: 'Bulk Actions',
  labelStyle: {},
  iconStyle: {},
  menuItemStyle: {},
  callBack: (value) => { callBackSpy(value) }
}

const getContext = () => ({
  store: {
    getState: () => ({}),
    subscribe: () => {},
    dispatch: () => {}
  },
  muiTheme: getMuiTheme(),
})

describe('(Component) ClientListActions.jsx', () => {
  let context = getContext()

  beforeEach(() => {
    context = getContext()
  })

  const buildWrapper = () => (
    mount(<ClientListActions {...props} />,
      {
        context,
        childContextTypes: {
          muiTheme: PropTypes.object,
          store: PropTypes.object
        }
      })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })

  it('should render total 5 options', () => {
    const wrapper = buildWrapper()
    wrapper.find(IconMenu).props().children.should.have.length(5)
  })

  describe('should have', () => {
    const wrapper = buildWrapper()
    it('option "None" at index 0', () => {
      wrapper.find(IconMenu).props().children[0].props.primaryText.should.be.equal('None')
      wrapper.find(IconMenu).props().children[0].props.value.should.be.equal('NONE')
    })
    it('option "Archive" at index 1', () => {
      wrapper.find(IconMenu).props().children[1].props.primaryText.should.be.equal('Archive')
      wrapper.find(IconMenu).props().children[1].props.value.should.be.equal('ARCHIVE')
    })
    it('option "Unarchive client" at index 2', () => {
      wrapper.find(IconMenu).props().children[2].props.primaryText.should.be.equal('Unarchive client')
      wrapper.find(IconMenu).props().children[2].props.value.should.be.equal('RESTORE')
    })
    it('option "Re-send invitation" at index 3', () => {
      wrapper.find(IconMenu).props().children[3].props.primaryText.should.be.equal('Re-send invitation')
      wrapper.find(IconMenu).props().children[3].props.value.should.be.equal('RESEND')
    })
    it('option "Cancel invitation" at index 4', () => {
      wrapper.find(IconMenu).props().children[4].props.primaryText.should.be.equal('Cancel invitation')
      wrapper.find(IconMenu).props().children[4].props.value.should.be.equal('CANCEL')
    })
  })

  describe('wrapper should', () => {
    const wrapper = buildWrapper()
    it('kept same state', () => {
      wrapper.find(IconMenu).props().onChange({}, 'RESEND')
      callBackSpy.should.be.calledWith('RESEND')
    })
  })
})
