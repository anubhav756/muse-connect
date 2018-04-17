import React from 'react';
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json';
import AddClient from '../../src/components/AddClient';
import mockContext from '../../__mocks__/mockContext';

jest.mock('../../src/redux/modules/clientList');

describe('<AddClient />', () => {
  const buildWrapper = (props, store) => (
    mount(<AddClient {...props} />, mockContext(store))
  )

  it('renders correctly', () => {
    const component = buildWrapper(
      {},
      { windowDimension: {}, clientList: { addingClient: false } }
      );
    component.setState({ open: true });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly for mobile devices', () => {
    const component = buildWrapper(
      {},
      { windowDimension: { innerWidth: 320 }, clientList: { addingClient: false } }
      );
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders modal correctly', () => {
    const component = buildWrapper(
      {},
      { windowDimension: {}, clientList: { addingClient: false } }
      );
    component.setState({ open: true });
    expect(toJSON(component)).toMatchSnapshot();
  });
  it('disables button while submitting', () => {
    const component = buildWrapper(
      {}, { windowDimension: {}, clientList: { addingClient: true } }
      );
    component.setState({ open: true })
    expect(toJSON(component)).toMatchSnapshot();
  });
  it('opens modal correctly', () => {
    const component = buildWrapper(
      {}, { windowDimension: {}, clientList: { addingClient: true } }
      );
    component.setState({ open: true });
    component.find('Paper').getElement().props.children.props.onClick();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('submits form correctly', () => {
    const component = buildWrapper(
      {}, { windowDimension: {}, clientList: { addingClient: true } }
      );
    component.setState({ open: true });
    component.find('Paper').getElement().props.children.props.onClick();
    component.update()
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Modal').getElement().props.actions[0].props.onClick();
    expect(toJSON(component)).toMatchSnapshot();
  });
});
