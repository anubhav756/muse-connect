import React from 'react'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';

export default function ReadMore() {
  return (
    <div style={{ fontSize: '14px', color: colors.darkGrey }}>
      <div>
        <p>
          Our connection with you is important to us and we want to stay in touch with you.
          To continue receiving email and other communications from us relating to this platform,
          including alerts to potential opportunities, news about our invitation-only special events
          and relevant business updates, please click the checkbox.
        </p>
        <p>
          If you change your mind regarding receiving future electronic correspondence in connection
          with this platform, you may email our
          Customer Care at <b>customercare@choosemuse.com</b> and
          specify whether you wish to subscribe or unsubscribe.
        </p>
      </div>
      <div style={{ marginTop: '15px', fontWeight: '600' }}>
        Interaxon Inc.<br />
        511 King Street, Suite 303<br />
        Toronto, Ontario,<br />
        M5V 1K4, Canada<br />
      </div>
    </div>
  )
}
