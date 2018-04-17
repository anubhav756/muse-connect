import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import { RefreshIndicator } from 'material-ui'
import InfiniteScrollLoader from '../../src/components/InfiniteScrollLoader'


const getContext = () => ({
  muiTheme: getMuiTheme()
})

const Props = {
  loading: true
}

describe('(Component) InfiniteScrollLoader', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = () => (
    mount(<InfiniteScrollLoader {...Props} />, {
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
  it('Material Referesh Indicator should exist', () => {
    wrapper.find(RefreshIndicator).should.have.length(1)
  })
})
