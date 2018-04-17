import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import should from 'should'
import CircularProgress from 'material-ui/CircularProgress'

import { getMuiTheme } from 'material-ui/styles'

import Loader from '../../src/components/Loader/Loader'


const getContext = () => ({
  muiTheme: getMuiTheme()
})

describe('(Component) App Loader', () => {
  let contextRef = getContext()

  beforeAll(() => {
    contextRef = getContext()
  })

  const buildWrapper = () => (
    shallow(<Loader />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.find('.circularProgress').should.have.length(1)
    wrapper.find(CircularProgress).should.have.length(1)
  })
})
