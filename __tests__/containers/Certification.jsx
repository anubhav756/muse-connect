import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Certification from '../../src/containers/BusinessProCertification';
import mockContext from '../../__mocks__/mockContext';
import fixtures from '../../__mocks__/fixtures.json';


jest.mock('../../src/redux/modules/certification')

describe('<Certification /> container', () => {
  const buildWrapper = (props, store) => mount(<Certification {...props} />, mockContext(store));

  it('renders', () => {
    const wrapper = buildWrapper(null, {
      certification: { isFetching: false },
      user: fixtures.user
    });
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
  it('renders while submitting', () => {
    const wrapper = buildWrapper(null, {
      certification: { isFetching: true },
      user: fixtures.user
    });
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
  it('submits form correctly', () => {
    const wrapper = buildWrapper(null, {
      certification: { isFetching: false },
      user: fixtures.user
    });
    wrapper.find('form').props().onSubmit();
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
  it('form doesn\'t submit with empty values', () => {
    const wrapper = buildWrapper(null, {
      certification: { isFetching: false },
      user: {
        ...fixtures.user,
        info: {
          ...fixtures.user.info,
          pro_certBody: null,
          pro_certNumber: null,
          eligible: false
        }
      }
    });
    wrapper.find('form').props().onSubmit();
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
  it('form doesn\'t accept invalid certification numbers', () => {
    const wrapper = buildWrapper(null, {
      certification: { isFetching: false },
      user: {
        ...fixtures.user,
        info: {
          ...fixtures.user.info,
          pro_certBody: 'Lorem Ipsum',
          pro_certNumber: 'Dolor sit amet',
          eligible: true
        }
      }
    });
    wrapper.find('form').props().onSubmit();
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
});
