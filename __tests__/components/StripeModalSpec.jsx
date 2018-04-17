import React from 'react';
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json';
import sinon from 'sinon';
import StripeModal from '../../src/components/StripeModal';
import mockContext from '../../__mocks__/mockContext';

jest.mock('../../src/redux/modules/subscription');


describe('<StripeModal />', () => {
  const buildWrapper = (props, store) => (
    mount(<StripeModal {...props} />, mockContext(store))
  )

  it('renders correctly', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {}
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with promoID', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {},
      promoID: 'test_promoID'
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('gets checkoutURL with promoID correctly', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {},
      promoID: 'test_promoID'
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('StripeModal').instance().getCheckoutURL();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {},
      disabled: true
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('enabled only prop checked correctly', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {}
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('stripeCheckout onClose method closes correctly', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {}
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('ReactStripeCheckout').props().closed();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('stripeCheckout onClose method without token invokes callback with true', () => {
    const spyCallback = sinon.spy();
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: spyCallback
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('ReactStripeCheckout').props().closed();
    expect(toJSON(component)).toMatchSnapshot();
    expect(spyCallback.calledWith()).toEqual(true);
  });

  it('stripeCheckout onToken method saves token correctly', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {}
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('ReactStripeCheckout').props().token({ id: 'test_token' });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('stripeCheckout onClose after onToken invokes callback correctly', () => {
    const component = buildWrapper({
      saveToken: () => {},
      button: <div />,
      amount: 100,
      stripeKey: 'test_stripeKey',
      user: { email: 'test@email.com' },
      callback: () => {}
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('ReactStripeCheckout').props().token({ id: 'test_token' });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('ReactStripeCheckout').props().closed();
    expect(toJSON(component)).toMatchSnapshot();
  });
});
