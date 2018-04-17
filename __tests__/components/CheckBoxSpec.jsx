import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'
import CheckboxComponent from '../../src/components/CheckBox'


const getContext = () => ({
  muiTheme: getMuiTheme(),
})

describe('(Component) Checkbox', () => {
  let contextRef = getContext()

  beforeAll(() => {
    contextRef = getContext()
  })

  const buildWrapper = () => (
    mount(<CheckboxComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
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
  })
})
