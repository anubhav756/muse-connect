import React from 'react'
import config from '../../config'

export default class CleverTapWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.initializeCleverTap = this.initializeCleverTap.bind(this)
  }
  componentWillMount() {
    this.initializeCleverTap()
  }
  initializeCleverTap() {
    window.clevertap = { event: [], profile: [], account: [], onUserLogin: [], notifications: [] }
    window.clevertap.account.push({ id: config.UTILITY.clevertap_id });
    const wzrk = document.createElement('script');
    wzrk.type = 'text/javascript';
    wzrk.async = true;
    wzrk.src = ('https:' == document.location.protocol ? 'https://d2r1yp2w7bby2u.cloudfront.net' : 'http://static.clevertap.com') + '/js/a.js';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wzrk, s);
  }
  render() {
    return (
      null
    )
  }
}
