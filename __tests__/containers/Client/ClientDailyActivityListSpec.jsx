import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import ClientDailyActivityList from '../../../src/containers/Client/ClientDailyActivity/ClientDailyActivityList'
import ClientSessionCard from '../../../src/containers/Client/ClientDailyActivity/ClientSessionCard'

const Props = {
  client:{},
  clientId: '12345',
  sessions: [],
  aggregateSessions: {
    info: {
      aggregateSessions: [
        {
          id: '123',
          calmTime: '120',
          activeTime: '20',
          neutralTime: '40'
        }
      ]
    }
  }
}

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const store = {
  getState: () => ({
    windowDimension: { innerWidth: '450px' }
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) ClientDailyActivityList Component', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = props => (
    mount(<ClientDailyActivityList {...props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
      }
    })
  )

  describe('', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper(Props)
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('ClientSessionCard should have length 0', () => {
      wrapper.find(ClientSessionCard).should.have.length(0)
    })
    describe('', () => {
      beforeAll(() => {
        Props.sessions = [{
          "recovery_count": 0,
          "no_headband": true,
          "bird_count": 0,
          "datetime": "2017-07-03T09:32:18.438Z",
          "environment": "",
          "session_length_seconds": 0,
          "compact_wind_scores": "",
          "id": "123",
          "instructions": ""
        }]
        wrapper = buildWrapper(Props)
      })
      it('ClientSessionCard should have length 1', () => {
        wrapper.find(ClientSessionCard).should.have.length(1)
      })
    })
  })
})
