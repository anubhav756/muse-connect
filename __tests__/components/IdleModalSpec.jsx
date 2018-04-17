import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'
import { getMuiTheme } from 'material-ui/styles'
import IdleModalComponent from '../../src/components/IdleModal'
import Modal from '../../src/components/Modal'

const toggleSpy = sinon.spy()

jest.mock('../../src/libs/cleverTap')


const Props = {
  open: false,
  toggleModal: toggleSpy
}



const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  windowDimension: {
    innerWidth: 768
  }
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) Idle Modal', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<IdleModalComponent {...Props} />, {
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
    it('remaining time should be 0', () => {
      wrapper.find('IdleModal').instance().state.remainingTime.should.equal(0)
    })
    it('remaining time should be 300', () => {
      wrapper.setProps({ open: true })
      wrapper.find('IdleModal').instance().state.remainingTime.should.equal(300)
    })
    it('should logout when remaining time set to 0', () => {
      wrapper.find('IdleModal').instance().setState({ remainingTime: 0 })
    })
    it('should call handleLogout onTouchTap  of Signout button', () => {
      wrapper.find(Modal).props().actions[1].props.onClick()
    })
    it('should call handleContinue onTouchTap  of Continue Session button', () => {
      wrapper.find(Modal).props().actions[0].props.onClick()
      toggleSpy.should.be.called()
    })
  })
})
