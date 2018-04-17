import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

import LearnImage from '../../src/components/LearnImage'


const getContext = () => ({
  muiTheme: getMuiTheme()
})

describe('(Component) LearnImage', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = () => (
    shallow(<LearnImage />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object
      }
    })
  )

  beforeAll(() => {
    contextRef = getContext()
    wrapper = buildWrapper()
  })
  it('should exist', () => {
    wrapper.should.have.length(1)
  })
})
