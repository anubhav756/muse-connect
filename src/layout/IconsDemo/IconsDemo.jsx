import React from 'react';
import '../../styles/global.scss';
import Icon from '../../components/Icon';

const icons = [
  'add-icon',
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
  'dot'
];

export default function View() {
  return (
    <div style={{ backgroundColor: 'green' }}>
      <h1>It Works!</h1>
      <p>This React project just works including, working great module local style</p>
      <p>Enjoy!</p>
      {icons.map(icon => <div key={icon}><Icon name={icon} /> - {icon}</div>)}
    </div>
  )
}
