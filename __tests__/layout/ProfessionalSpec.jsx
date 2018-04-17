import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import {
  FlatButton,
  Popover
} from 'material-ui'
import { getMuiTheme } from 'material-ui/styles'

import Layout from '../../src/layout/Professional'
import Header from '../../src/layout/Professional/Header'
import SideBar from '../../src/layout/Professional/SideBar'
import { mockStore } from '../../__mocks__/mockContext'
import { user } from '../../__mocks__/fixtures.json'

jest.mock('../../src/libs/cleverTap')


const getContext = () => ({
  muiTheme: getMuiTheme(),
  store: mockStore({
    user,
    windowDimension: { innerWidth: 1200 },
    routing: { locationBeforeTransitions: { pathname: '' } },
    clientList: {
      clients: {
        isFetching: false,
        isError: false,
        info: {}
      }
    } }),
  router: {
    location: {
      pathname: ''
    }
  }
})

const Props = {
  initWpAndLoadCategories: () => {}
}
describe('(Layout) Professional', () => {
  let context = getContext({})
  let wrapper = null
  let headerWrapper = null

  const buildWrapper = () => (
  mount(<Layout {...Props} />,
    {
      context,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        router: PropTypes.object,
      }
    })
  )

  const buildHeaderWrapper = () => (
  mount(<Header />,
    {
      context,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        router: PropTypes.object,
      }
    })
  )
  beforeAll(() => {
    context = getContext({})
    wrapper = buildWrapper()
    headerWrapper = buildHeaderWrapper()
  })

  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  it('Layout header should exist', () => {
    wrapper.find(Header).should.have.length(1)
  })
  it('Sidebar toggle button should have state open false', () => {
    wrapper.find('Header').instance().state.open.should.equal(false)
  })
  it('Sidebar toggle button should have state open true as touch tap happens over it', () => {
    wrapper.find('Header').find(FlatButton).getElement().props.onClick({ preventDefault: () => {} })
    wrapper.find('Header').instance().state.open.should.equal(true)
  })
  it('OnRequestClose of Popover toggle button should have state open false', () => {
    wrapper.find('Header').find(Popover).at(1).getElement().props.onRequestClose()
    wrapper.find('Header').instance().state.open.should.equal(false)
  })
  it('Layout sidebar should exist', () => {
    wrapper.find(SideBar).should.have.length(1)
  })
  it('should call handleNavClick onClick of close button over sidebar drawer', () => {
    wrapper.find(SideBar).find('FlatButton').at(0).getElement().props.onClick('')
  })
})
