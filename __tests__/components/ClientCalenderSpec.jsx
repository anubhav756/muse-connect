import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

import CalendarComponent from '../../src/components/ClientCalendar'
import CustomCalendar from '../../src/components/ClientCalendar/CustomCalendar'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const store = {
  getState: () => ({
    client: {
      aggregateSessions: {
        isFetching: false,
        isError: false,
        info: {
          aggregateDays: {}
        },
      }
    }
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) Calendar Component', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<CalendarComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
        router: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })

  it('should render custom calendar', () => {
    const wrapper = buildWrapper()
    wrapper.find(CustomCalendar).should.have.length(1)
  })

  it('should render monthly details of session durations and count', () => {
    const wrapper = buildWrapper()
    wrapper.find('.sessionDetailsCal').should.have.length(1)
  })
})
