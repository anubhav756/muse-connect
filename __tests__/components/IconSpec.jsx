import React from 'react';
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Icon from '../../src/components/Icon';

const icons = [
  'add-icon',
  'subtract-icon',
  'archive-icon',
  'bookmark-icon',
  'bug-icon',
  'cart-icon',
  'cart-reversed-icon',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'chevron-white-down',
  'clients-icon',
  'dark',
  'daytime',
  'delete-icon',
  'email-icon',
  'error-icon',
  'evening',
  'fab-icon-share',
  'facebook',
  'home-icon',
  'instagram',
  'linkedin',
  'icon-pending',
  'icon-search',
  'twitter',
  'pagination',
  'location-pin',
  'logout-icon',
  'menu-icon',
  'more-options-reversed-icon',
  'send-icon',
  'pin-icon',
  'pinned-toggle-icon',
  'search-reversed-icon',
  'search-white-icon',
  'settings-icon',
  'settings-small-icon',
  'sunrise',
  'tooltip-icon',
  'x-grey-icon',
  'x-icon',
  'x-reversed-icon',
  'youtube',
  'dot',
  'arrow-dropdown-reverse'
];

test('<Icon /> component', () => {
  const component = renderer.create(
    <MuiThemeProvider>
      <div>
        {icons.map(icon => <Icon key={icon} name={icon} />)}
      </div>
    </MuiThemeProvider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
