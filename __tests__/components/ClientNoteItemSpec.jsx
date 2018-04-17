import React from 'react';
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json';
import { FlatButton } from 'material-ui';
import sinon from 'sinon'
import ClientNoteItem from '../../src/components/ClientNoteItem';
import mockContext from '../../__mocks__/mockContext';

jest.mock('../../src/redux/modules/clientList');

const noteProps = {
  wd: {},
  id: '1',
  createdAt: '2018-02-27T09:51:42.073Z',
  title: 'Test Title',
  content: 'Test content'
};

describe('<ClientNoteItem />', () => {
  const buildWrapper = (props, store) => (
    mount(<ClientNoteItem {...props} />, mockContext(store))
  )
  it('renders correctly', () => {
    const component = buildWrapper({ ...noteProps, disabled: true });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly for mobile devices', () => {
    const component = buildWrapper(
      { ...noteProps, wd: { innerWidth: 320 } }
    );
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('calls onClick of FlatButton', () => {
    const component = buildWrapper(
      { ...noteProps, deleteNote: sinon.spy() }
    );
    component.find(FlatButton).at(1).getElement().props.onClick();
    component.find('a').getElement().props.onClick();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('calls onClick of FlatButton, When alert throws error', () => {
    const component = buildWrapper(noteProps);
    // component.setState({ open: true });
    component.find(FlatButton).at(1).getElement().props.onClick();
    component.find('a').getElement().props.onClick();
    expect(toJSON(component)).toMatchSnapshot();
  });
});
