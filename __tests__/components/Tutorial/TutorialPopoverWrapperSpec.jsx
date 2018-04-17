import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'

import { getMuiTheme } from 'material-ui/styles'

import TutorialPopoverWrap from '../../../src/components/TutorialPopover'
import TutorialPopover from '../../../src/components/TutorialPopover/TutorialPopover'

const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const Props = {
  keyName: 'Add_Client',
  text: 'text',
  title: 'title'
}

const storeState = {
  tutorial: {
    tutorialCards: {}
  }
}

const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) Tutorial Popover Wrapper', () => {
  let contextRef = getContext(store)
  let wrapper = null
  const buildWrapper = () => (
    mount(<TutorialPopoverWrap {...Props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  beforeAll(() => {
    contextRef = getContext(store)
    wrapper = buildWrapper()
  })
  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  it('should call _handleCloseTutorial onCloseTutorial', () => {
    const component = wrapper.find('TutorialPopOverWrapper')
    component.find(TutorialPopover).getElement().props.onCloseTutorial()
  })
})
