import React from 'react'
import { mount } from 'enzyme'
import 'should-sinon'
import toJSON from 'enzyme-to-json';
import mockContext from '../../../__mocks__/mockContext'

import ClientListComponent from '../../../src/containers/ClientList/ClientList'
import { clientList } from '../../../__mocks__/fixtures.json';


const getContext = custom => mockContext({
  windowDimension: {
    innerWidth: 768
  },
  clientList: { clients: clientList },
  ...custom
})

describe('(Container) ClientList', () => {
  const buildWrapper = custom => (
    mount(<ClientListComponent />, getContext(custom))
  )

  it('should exist', () => {
    const wrapper = buildWrapper()
    wrapper.should.have.length(1)
  })

  describe('should render', () => {
    it('for desktop', () => {
      const wrapper = buildWrapper({ windowDimension: { innerWidth: 1024 } });
      expect(toJSON(wrapper)).toMatchSnapshot();
    })
    it('for tablet', () => {
      const wrapper = buildWrapper({ windowDimension: { innerWidth: 768 } });
      expect(toJSON(wrapper)).toMatchSnapshot();
    })
    it('for mobile', () => {
      const wrapper = buildWrapper({ windowDimension: { innerWidth: 480 } });
      expect(toJSON(wrapper)).toMatchSnapshot();
    })
  })

  it('should fetch clients', () => {
    const wrapper = buildWrapper({ clientList: { clients: clientList } });
    expect(toJSON(wrapper)).toMatchSnapshot();
  })

  it('should show message if no clients received', () => {
    const wrapper = buildWrapper({ clientList: { clients: clientList } });
    expect(toJSON(wrapper)).toMatchSnapshot();
  })

  it('sets weekday correctly', () => {
    const wrapper = buildWrapper();
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ ...wrapper.props(), clientList: { isFetching: true } });
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
})
