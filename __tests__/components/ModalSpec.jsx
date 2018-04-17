import React from 'react';
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json';
import Modal, { CancelModal, alert } from '../../src/components/Modal';
import mockContext from '../../__mocks__/mockContext';


describe('<Modal />', () => {
  const buildWrapper = (props, store, isCancelModal) => (
    mount(isCancelModal ? <CancelModal {...props} /> : <Modal {...props} />, mockContext(store))
  )

  it('<Modal /> component', () => {
    const component = buildWrapper({
      title: 'test modal',
      open: true,
      toggleModal: () => {}
    });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('<CancelModal /> renders correctly', () => {
    const component = buildWrapper({
      title: 'test modal',
      open: true,
      toggleModal: () => {}
    },
    null,
    true
    );
    expect(toJSON(component)).toMatchSnapshot();
    alert('This is a test');
  });

  it('<CancelModal /> handles yes', () => {
    const component = buildWrapper(null, null, true);
    alert('This is a test');
    component.find('Dialog').getElement().props.actions[0].props.onClick();
    expect(toJSON(component)).toMatchSnapshot();
  });
  it('<CancelModal /> handles no', () => {
    const component = buildWrapper(null, null, true);
    alert('This is a test');
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Dialog').getElement().props.actions[1].props.onClick();
  });
});
