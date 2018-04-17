import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'

import SubscriptionCard from '../../src/components/SubscriptionCard'

const fn = () => {}
const selectSpy = sinon.spy(fn)


const getContext = () => ({
  muiTheme: getMuiTheme()
})

const Props = {
  title: 'dummy_text',
  description: 'dummy_text',
  subtext: 'dummy_text',
  header: 'header_text',
  price: '39',
  buttonLabel: 'Pay',
  plan: {},
  selected: false,
  termsModal: true,
  onSelected: selectSpy,
  moreInfo: [
    'this is info text'
  ]
}

describe('(Component) SubscriptionCard', () => {
  let contextRef = getContext()
  let wrapper = null
  const buildWrapper = props => (
    shallow(<SubscriptionCard {...props} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object
      }
    })
  )
  beforeAll(() => {
    contextRef = getContext()
    wrapper = buildWrapper(Props)
  })
  it('should exist', () => {
    wrapper.should.have.length(1)
  })
  it('should have state { modalOpen: false }', () => {
    wrapper.state().modalOpen.should.be.false()
  })
  it('_handleSelect should be called when select', () => {
    wrapper.find({ label: 'Pay' }).getElement().props.onClick()
    selectSpy.should.be.called()
  })
})

