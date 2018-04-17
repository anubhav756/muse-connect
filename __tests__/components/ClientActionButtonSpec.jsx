import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import ClientActionButton from '../../src/components/ClientActionButton'

const Props = {
  onPress: () => {},
  type: 'ARCHIVE_CLIENT'
}

const getContext = () => ({
  muiTheme: getMuiTheme(),
})

describe('(Component) ClientActionButton', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = () => (
    mount(<ClientActionButton {...Props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
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
