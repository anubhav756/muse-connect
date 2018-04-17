import React from 'react'
import config from '../../config'

export default class ChatraWidget extends React.Component {
  constructor(props) {
    super(props)
    this.initializeChatraWidget = this.initializeChatraWidget.bind(this)
  }
  componentWillMount() {
    // initialize chat widget
    this.initializeChatraWidget(document, window, 'Chatra')
  }

  initializeChatraWidget(d, w, c) {
    const { UTILITY } = config
    w.ChatraID = UTILITY.chatra_id;
    var s = d.createElement('script');
    w[c] = w[c] || function()
    { (w[c].q = w[c].q || []).push(arguments); }
    ;
    s.async = true;
    s.src = (d.location.protocol === 'https:' ? 'https:': 'http:')
    + '//call.chatra.io/chatra.js';
    if (d.head) d.head.appendChild(s);
  }
  render() {
    return (
      null
    )
  }
}
