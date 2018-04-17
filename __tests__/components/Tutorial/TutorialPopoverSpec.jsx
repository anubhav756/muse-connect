import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import TutorialPopover from '../../../src/components/TutorialPopover/TutorialPopover'

const getContext = () => ({
  muiTheme: getMuiTheme()
})

const Props = {
  text: 'text',
  title: 'title',
  onCloseTutorial: () => {}
}

describe('(Component) TutorialPopover', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = () => (
    mount(<TutorialPopover {...Props} />, {
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
