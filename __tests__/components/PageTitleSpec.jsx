import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { FlatButton } from 'material-ui';

import { getMuiTheme } from 'material-ui/styles'

import PageTitle from '../../src/components/PageTitle'


const getContext = () => ({
  muiTheme: getMuiTheme()
})

const Props = {
  text: 'title',
  backLink: 'Dummy text'
}

describe('(Component) PageTitle', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = () => (
    mount(<PageTitle {...Props} />, {
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
  it('should call browser history onClick of onTouchTap', () => {
    wrapper.find(FlatButton).getElement().props.onClick()
  })
})
