import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'
import { RecentActivity } from '../../../src/containers/Dashboard/Cards/RecentActivity'
import { CLIENT_NAME, ALL } from '../../../src/libs/helpers/clientList'


const getContext = () => ({
  muiTheme: getMuiTheme(),
})

const Props = {
  clientList: {
    statusFilter: ALL,
    sortByColumn: CLIENT_NAME,
    reverse: false,
    clients: {
      isFetching: true,
      isError: false,
      info: {
        active_clients: []
      }
    },
    displayList: [],
    addingClient: false
  },
}

describe('(Dashboard view) Recent Activity Card', () => {
  let contextRef = null
  beforeAll(() => {
    contextRef = getContext()
  })

  const buildWrapper = () => (
    mount(<RecentActivity {...Props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
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
    it('should render items too if component get rendered before fetching clients', () => {
      const clientList = _.cloneDeep(Props.clientList)
      clientList.clients.isFetching = false
      wrapper.setProps({ clientList })
    })
  })
})
