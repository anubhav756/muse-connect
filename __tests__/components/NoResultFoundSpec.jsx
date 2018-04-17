import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import NoResultFoundCard from '../../src/components/NoResultFoundCard'


const getContext = () => ({
  muiTheme: getMuiTheme()
})

describe('(Component) NoResultFoundCard', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = () => (
    mount(<NoResultFoundCard />, {
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
