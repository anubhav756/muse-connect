import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

import ErrorMessage from '../../src/components/ErrorMessage'


global.location.reload = () => { }
const reloadSpy = sinon.spy(location, 'reload')

const getContext = () => ({
  muiTheme: getMuiTheme()
})

describe('(Component) Content ErrorMessage', () => {
  let contextRef = getContext()
  let wrapper = null
  beforeAll(() => {
    contextRef = getContext()
    wrapper = buildWrapper()
  })

  const buildWrapper = () => (
    shallow(<ErrorMessage />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object
      }
    })
  )

  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  it('should reload the page if user click', () => {
    wrapper.find('.hyperLinkErrorMessage').getElement().props.onClick()
    reloadSpy.should.be.called()
  })
})

