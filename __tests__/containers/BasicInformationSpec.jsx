import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'
import { getMuiTheme } from 'material-ui/styles'

import BasicInformation from '../../src/containers/BasicInformation'
import Modal from '../../src/components/Modal'
import termsObject from '../../src/redux/modules/basicInfo'

jest.mock('../../src/redux/modules/basicInfo')

const doRegisterSpy = sinon.spy(termsObject, 'getPayload')


const storeState = {
  basicInfo: { isRegistering: false },
  user: {
  }
}

const updatedStoreState = {
  basicInfo: { isRegistering: true },
  user: {
    info: {
      firstName: 'Jasna',
      lastName: 'todorovic'
    }
  }
}

const getContext = State => ({
  store: {
    getState: () => (State),
    subscribe: () => { },
    dispatch: () => { }
  },
  muiTheme: getMuiTheme(),
})

describe('(Container) BasicInformation', () => {
  let context = getContext(storeState)

  beforeEach(() => {
    context = getContext(storeState)
  })

  const buildWrapper = () => (
    mount(<BasicInformation />,
      {
        context,
        childContextTypes: {
          muiTheme: PropTypes.object,
          store: PropTypes.object
        }
      })
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    should.exist(wrapper)
  })

  describe('should render', () => {
    const wrapper = buildWrapper()
    it('text field for firstName', () => {
      wrapper.find('input').find({ name: 'firstName' }).should.have.length(1)
    })

    it('text field for lastName', () => {
      wrapper.find('input').find({ name: 'lastName' }).should.have.length(1)
    })

    it('text field for phone number', () => {
      wrapper.find('input').find({ name: 'phone' }).should.have.length(1)
    })

    it('select field for country', () => {
      wrapper.find('SelectField').should.have.length(1)
      wrapper.find('SelectField').getElement().props.name.should.equal('country')
    })

    it('radio buttons for current muser ', () => {
      wrapper.find('#currentMuserRadio').should.have.length(1)
    })

    it('checkbox for terms and condition acceptance', () => {
      wrapper.find('#tosAccepted').should.have.length(1)
    })

    it('checkbox for emailOptIn', () => {
      wrapper.find('#emailOptIn').should.have.length(1)
    })

    it('submit button with lable Create Your Account', () => {
      wrapper.find('RaisedButton').should.have.length(1)
      wrapper.find('RaisedButton').getElement().props.label.should.equal('Save and continue')
    })

    it('communication modal', () => {
      wrapper.find('Modal').should.have.length(1)
    })

    it('should render error msg if any field required is empty on Submit', () => {
      // todo
    })
  })

  describe('Communication Modal', () => {
    it('should be open on toggle Modal', () => {
      const wrapper = buildWrapper()
      wrapper.find(Modal).props().toggleModal()
      wrapper.update()
      wrapper.find(Modal).props().open.should.be.true()
    })

    it('should be closed if Modal is toggled twice', () => {
      // todo
    })
  })

  describe('updated', () => {
    beforeEach(() => {
      context = getContext(updatedStoreState)
    })

    it('should call dispatch preset field values', () => {
      const wrapper = buildWrapper()
      wrapper.find({ id: 'BasicInfoForm' }).simulate('submit')
      doRegisterSpy.should.be.calledWith({
        firstName: 'Jasna',
        lastName: 'todorovic',
        country: undefined,
        currentMuser: 0,
        emailOptIn: undefined,
        phone: undefined,
        tosAccepted: undefined
      })
    })

    it('submit button should be disabled as terms.isFetching is true', () => {
      const wrapper = buildWrapper()
      wrapper.find('RaisedButton').props().disabled.should.be.true()
    })
  })
})
