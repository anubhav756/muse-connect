import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

// import ClientDailyActivity from '../../../src/containers/Client/ClientDailyActivity/ClientDailyActivity'
import ClientDailyActivityWrapper from '../../../src/containers/Client/ClientDailyActivity'
// import Loader from '../../../src/components/Loader/ContentLoader'


const Props = {
  clientId: '12345',
}

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const store = {
  getState: () => ({
    client: {
      client: {},
      aggregateSessions: {},
      dailySessions: {
        isError: false,
        isFetching: false,
        info: { sessions: [] }
      }
    }
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) ClientDailyActivityWrapper Component', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = props => (
    mount(<ClientDailyActivityWrapper {...props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        router: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper(Props)
    wrapper.should.have.length(1)
  })
})
