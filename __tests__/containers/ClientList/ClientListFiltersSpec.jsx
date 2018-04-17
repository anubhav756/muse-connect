import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import 'should-sinon'
import sinon from 'sinon'

import { getMuiTheme } from 'material-ui/styles'

import ClientListFiltersComponent from '../../../src/containers/ClientList/ClientListFilters'
import StatusFilterDropDown from '../../../src/components/SelectDropDown/wrappers/StatusFilter'
// import ClientsSortBy from '../../../src/components/SelectDropDown/wrappers/ClientsSortBy'
// import ClientListActions from '../../../src/components/ActionsDropDown/ClientListActions'


const getContext = () => ({
  store: {
    getState: () => ({ windowDimension: { innerWidth: '768' }, clientList: { sortByColumn: 'CLIENT_NAME', statusFilter: 'ALL' } }),
    subscribe: () => { },
    dispatch: () => { }
  },
  muiTheme: getMuiTheme(),
})

describe('(Container) ClientListFilters.jsx', () => {
  let context = getContext()
  const dispatchSpy = sinon.spy(context.store, 'dispatch')
  beforeEach(() => {
    context = getContext()
  })

  const buildWrapper = () => (
    mount(<ClientListFiltersComponent />,
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

  describe('should render', () => {
    const wrapper = buildWrapper()
    // it('Bulk Actions Drop menu', () => {
    //   wrapper.find(ClientListActions).should.have.length(1)
    // })

    it('Filter clients by status select dropdown', () => {
      wrapper.find(StatusFilterDropDown).should.have.length(1)
    })

    // it('Sort clients by select dropdown', () => {
    //   wrapper.find(ClientsSortBy).should.have.length(1)
    // })
  })

  describe('should call', () => {
    const wrapper = buildWrapper()
    it('handleStatusFilter() on callBack of Status Filter Dropdown component', () => {
      wrapper.find(StatusFilterDropDown).props().callBack()
      dispatchSpy.should.be.called()
    })
    // it('handleClientsSortBy() on callBack of Status Filter Dropdown component', () => {
    //   wrapper.find(ClientsSortBy).props().callBack()
    //   dispatchSpy.should.be.calledTwice()
    // })
  })
})
