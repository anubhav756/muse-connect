import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { SideBarComponent } from '../../src/layout/Professional/SideBar';
import endPoints from '../../src/routes/endPoints';

test('<Sidebar /> component', () => {
  const component = renderer.create(
    <MuiThemeProvider>
      <SideBarComponent
        user={{
          info: {
            organization_name: 'test organization',
            user: {
              preferences: {
                user_preferences_settings: {
                  first_name: 'test',
                  last_name: '123',
                }
              }
            }
          }
        }}
        open
        toggleSideBar={() => { }}
        currentRoute={endPoints.dashboard}
      />
    </MuiThemeProvider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
