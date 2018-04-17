import React from 'react';
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json';
import EditableLabel from '../../src/components/EditableLabel';
import mockContext from '../../__mocks__/mockContext';


describe('<EditableLabel />', () => {
  const buildWrapper = (props, store) => (
    mount(<EditableLabel {...props} />, mockContext(store))
  )

  it('renders correctly', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value',
      title: 'test title',
      onChange: () => { }
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('errors correctly without onChange', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value',
      title: 'test title',
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with a valid edit label', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value',
      title: 'test title',
      onChange: () => { },
      editLabel: 'test edit label'
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with a extra label', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value',
      title: 'test title',
      onChange: () => { },
      editLabel: 'test edit label',
      extraLabel: 'test extra label'
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with a extra label and loading', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value',
      title: 'test title',
      onChange: () => { },
      editLabel: 'test edit label',
      extraLabel: 'test extra label',
      loading: true
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly while loading', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value',
      title: 'test title',
      onChange: () => { },
      editLabel: 'test edit label',
      loading: true
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with multiple values', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: ['test value 1', 'test value 2'],
      title: ['test title 1', 'test title 2'],
      onChange: () => { },
      editLabel: 'test edit label',
      iconNames: ['add-icon']
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with loading and multiple values', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: ['test value 1', 'test value 2'],
      title: ['test title 1', 'test title 2'],
      onChange: () => { },
      editLabel: 'test edit label',
      loading: true,
      iconNames: ['add-icon']
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with multiple edit labels and multiple values', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: ['test value 1', 'test value 2'],
      title: ['test title 1', 'test title 2'],
      onChange: () => { },
      editLabel: ['test edit label 1', 'test edit label 2'],
      iconNames: ['add-icon']
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with multiple edit labels and multiple values and loading', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: ['test value 1', 'test value 2'],
      title: ['test title 1', 'test title 2'],
      onChange: () => { },
      editLabel: ['test edit label 1', 'test edit label 2'],
      iconNames: ['add-icon'],
      loading: true
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly in mobile view', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: ['test value 1', 'test value 2'],
      title: ['test title 1', 'test title 2'],
      onChange: () => { },
      editLabel: ['test edit label 1', 'test edit label 2'],
      iconNames: ['add-icon']
    }, {
        windowDimension: { innerWidth: 320 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('renders correctly with vertical buttons', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: ['test value 1', 'test value 2'],
      title: ['test title 1', 'test title 2'],
      onChange: () => { },
      editLabel: ['test edit label 1', 'test edit label 2'],
      iconNames: ['add-icon'],
      verticalButtons: true
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('toggles editmode on focus correctly', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('toggles editmode on focus correctly in label only mode', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
      labelOnly: true
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('toggles and untoggles editmode correctly', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
    }, {
      windowDimension: { innerWidth: 1200 }
    });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').children('div').children('div').children('div')
      .children('input')
      .props()
      .onBlur();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('changes value correctly', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').children('div').children('div').children('div')
      .children('input')
      .props()
      .onChange({ target: { value: 'test new value' } });
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('fires on keyup event with keycode 13 correctly', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').children('div').children('div').children('div')
      .children('input')
      .props()
      .onKeyUp({ keyCode: 13 });
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('fires on keyup event with keycode 14 correctly', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
    }, {
        windowDimension: { innerWidth: 1200 }
      });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').children('div').children('div').children('div')
      .children('input')
      .props()
      .onKeyUp({ keyCode: 14 });
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
  });

  it('toggles and untoggles editmode correctly in mobile view', () => {
    const component = buildWrapper({
      tabIndex: '0',
      value: 'test value 1',
      title: 'test title 1',
      onChange: () => { },
      editLabel: 'test edit label 1',
    }, {
        windowDimension: { innerWidth: 320 }
      });
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').props().onFocus();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
    component.find('Paper').children('div').children('div').children('div')
      .children('input')
      .props()
      .onBlur();
    component.update();
    expect(toJSON(component)).toMatchSnapshot();
  });

  // it('toggles and untoggles editmode correctly with multiple value and titles', () => {
  //   const component = buildWrapper({
  //     tabIndex: '0',
  //     value: ['test value 1', 'test value 2'],
  //     title: ['test title 1', 'test title 2'],
  //     onChange: () => {},
  //     editLabel: 'test edit label 1',
  //   }, {
  //     windowDimension: { innerWidth: 320 }
  //   });
  //   expect(toJSON(component)).toMatchSnapshot();
  //   component.find('Paper').props().onFocus();
  //   expect(toJSON(component)).toMatchSnapshot();
  //   component.find('Paper').children('div').children('div').children('input')
  //     .props()
  //     .onBlur();
  //   expect(toJSON(component)).toMatchSnapshot();
  // });
});
