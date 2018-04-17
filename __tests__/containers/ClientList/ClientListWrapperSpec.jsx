import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import ClientListWrapper from '../../../src/containers/ClientList/ClientListWrapper'
import ClientListFiltersComponent from '../../../src/containers/ClientList/ClientListFilters'
import ClientListComponent from '../../../src/containers/ClientList/ClientList'


const getContext = () => ({
  store: {
    getState: () => ({}),
    subscribe: () => {},
    dispatch: () => {}
  },
  muiTheme: getMuiTheme(),
})

describe('(Container) ClientListWrapper.jsx', () => {
  let context = getContext()

  beforeEach(() => {
    context = getContext()
  })

  const buildWrapper = () => (
    shallow(<ClientListWrapper />,
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
    it('ALL CLIENTS as heading', () => {
      wrapper.find('.TitleStyleClientList').text().should.equal('ALL CLIENTS')
    })

    it('Client list filters component', () => {
      wrapper.find(ClientListFiltersComponent).should.have.length(1)
    })

    it('Client list component', () => {
      wrapper.find(ClientListComponent).should.have.length(1)
    })
  })
})
