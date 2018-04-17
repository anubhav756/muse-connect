import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'
import SelectField from 'material-ui/SelectField'

import ClientsSortBy from '../../../src/components/SelectDropDown/wrappers/ClientsSortBy'

const props = {
  style: {},
  labelStyle: {},
  iconStyle: {},
  selectedMenuItemStyle: {},
  className: '',
  menuItemStyle: {},
  callBack: () => { },
  value: 'CLIENT_NAME'
}

const getContext = () => ({
  store: {
    getprop: () => ({}),
    getState: () => ({ clientList: { sortByColumn: 'CLIENT_NAME' } }),
    subscribe: () => { },
    dispatch: () => { }
  },
  muiTheme: getMuiTheme(),
})

describe('(Component) ClientsSortBy.jsx', () => {
  let context = getContext()

  beforeEach(() => {
    context = getContext()
  })

  const buildWrapper = () => (
    mount(<ClientsSortBy {...props} />,
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
    it('option "alphabetical by first name" at index 0', () => {
      wrapper.find(SelectField).props().children[0].props.primaryText.should.be.equal('alphabetical by first name')
    })
    it('option "most recent activity" at index 1', () => {
      wrapper.find(SelectField).props().children[1].props.primaryText.should.be.equal('most recent activity')
    })
    it('option "recently viewed" at index 2', () => {
      wrapper.find(SelectField).props().children[2].props.primaryText.should.be.equal('recently viewed')
    })
    it('option "recently added" at index 3', () => {
      wrapper.find(SelectField).props().children[3].props.primaryText.should.be.equal('recently added')
    })
  })

  describe('wrapper should', () => {
    const wrapper = buildWrapper()
    it('have "CLIENT_NAME" set as default prop', () => {
      wrapper.props().value.should.be.equal('CLIENT_NAME')
    })
  })
})
