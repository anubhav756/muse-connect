import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'
import SelectField from 'material-ui/SelectField'

import ClientsStatusFilter from '../../../src/components/SelectDropDown/wrappers/StatusFilter'

const props = {
  style: {},
  labelStyle: {},
  iconStyle: {},
  selectedMenuItemStyle: {},
  className: '',
  menuItemStyle: {},
  callBack: () => { }
}

const getContext = () => ({
  store: {
    getState: () => ({ clientList: { statusFilter: 'ALL' } }),
    subscribe: () => { },
    dispatch: () => { }
  },
  muiTheme: getMuiTheme(),
})

describe('(Component) ClientsStatusFilter.jsx', () => {
  let context = getContext()

  beforeEach(() => {
    context = getContext()
  })

  const buildWrapper = () => (
    mount(<ClientsStatusFilter {...props} />,
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
    should.exist(wrapper)
  })

  it('should render total 5 options', () => {
    const wrapper = buildWrapper()
    wrapper.find(SelectField).props().children.should.have.length(5)
  })

  describe('should have', () => {
    const wrapper = buildWrapper()
    it('option "all Clients" at index 0', () => {
      wrapper.find(SelectField).props().children[0].props.primaryText.should.be.equal('all clients')
      wrapper.find(SelectField).props().children[0].props.value.should.be.equal('ALL')
    })
    it('option "active clients" at index 1', () => {
      wrapper.find(SelectField).props().children[1].props.primaryText.should.be.equal('active clients')
      wrapper.find(SelectField).props().children[1].props.value.should.be.equal('ACCEPTED')
    })
    it('option "pending invitations" at index 2', () => {
      wrapper.find(SelectField).props().children[2].props.primaryText.should.be.equal('pending invitations')
      wrapper.find(SelectField).props().children[2].props.value.should.be.equal('INVITED')
    })
    it('option "archived clients" at index 3', () => {
      wrapper.find(SelectField).props().children[3].props.primaryText.should.be.equal('archived clients')
      wrapper.find(SelectField).props().children[3].props.value.should.be.equal('ARCHIVED')
    })
    it('option "stopped sharing" at index 4', () => {
      wrapper.find(SelectField).props().children[4].props.primaryText.should.be.equal('stopped sharing')
      wrapper.find(SelectField).props().children[4].props.value.should.be.equal('STOPPED')
    })
    it('should have "all clients" as default selected', () => {
      wrapper.find(SelectField).props().value.should.be.equal('ALL')
    })
  })

  describe('wrapper should', () => {
    const wrapper = buildWrapper()
    it('have "ALL" set as default state', () => {
      wrapper.find(SelectField).props().value.should.be.equal('ALL')
    })

    it('change state when on change called', () => {
      wrapper.find(SelectField).props().onChange({}, '1', 'ACCEPTED')
      wrapper.find(SelectField).props().value.should.be.equal('ALL')
    })

    it('kept same state', () => {
      wrapper.find(SelectField).props().onChange({}, '3', 'INVITED')
      wrapper.find(SelectField).props().value.should.be.equal('ALL')
      wrapper.find(SelectField).props().onChange({}, '3', 'INVITED')
      wrapper.find(SelectField).props().value.should.be.equal('ALL')
    })
  })
})
