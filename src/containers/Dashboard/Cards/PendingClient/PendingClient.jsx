import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import {
  Paper,
  FlatButton
} from 'material-ui';
import moment from 'moment'
import _ from 'lodash'
import { isDate } from 'libs/helpers/common'
import { resendInvitation as _resendInvitation, RESEND_INVITATION_END } from 'redux/modules/clientList'
import Loader from 'components/Loader/ContentLoader'
import ListItem from 'components/ClientListItem'
import { INVITED, applyStatusFilter } from 'libs/helpers/clientList'
import AddClient from 'components/AddClient'
import style from './style'
import './PendingClient.scss'

export class PendingClient extends Component {
  constructor(props) {
    super(props)
    this._getPendingClients = this._getPendingClients.bind(this)
  }
  _getPendingClients() {
    const {
      clientList: { clients: { info } },
      resendInvitation
    } = this.props;

    const muserInvitedClients = applyStatusFilter(info, INVITED) || []
    // Sort Pending clients by date
    const pendingClients = _.orderBy(
      muserInvitedClients,
      (client) => {
        const date = client.date || client.createDate
        return isDate(date) && new Date(date)
      },
      'desc'
    );

    return pendingClients.map(listItem => (
      <div key={listItem.email} className="listItemWrap">
        <ListItem
          heading={`${listItem.email}`}
          headingClassName="titlePendingClient"
          dividerClassName="listItemDividerPendingClient"
          subHeading={<div>
            <div>
              Invited on {moment(listItem.date || listItem.createDate).format('MMMM D, Y')}
            </div>
            <div id="inviteAcctStatusPendingClient">
              {
                listItem.nonMuser
                  ? <span>Needs a Muse account</span>
                  : <span>Has a Muse account</span>
              }
            </div>
          </div>}
          listItemBodyStyle={style.listItemBodyStyle}
          divider
          dividerStyle={style.listItemDividerStyle}
          action={[
            <div key={`resend+${listItem.email}`} className="actionPendingClient">
              <FlatButton
                disabled={!!listItem.__clientAction}
                label={
                  <span style={style.labelItemStyle}>
                    {
                      listItem.__clientAction === RESEND_INVITATION_END ?
                        'SENT' :
                        listItem.__clientAction ?
                          'SENDING...' :
                          'RE-SEND'
                    }
                  </span>
                }
                labelStyle={style.listItemLabelStyle}
                primary
                key="1"
                onClick={() => resendInvitation(listItem.id, listItem.nonMuser)}
                style={style.listItemStyle}
              />
            </div>
          ]}
        />
      </div>
    ))
  }

  render() {
    const {
      clientList: {
        clients: { isFetching }
      },
    } = this.props
    if (isFetching)
      return (
        <Paper rounded={false} style={style.paperStyle}>
          <Loader zDepth={0} />
        </Paper>
      )

    const PendingClients = this._getPendingClients()
    return (
      <Paper rounded={false} style={style.paperStyle}>
        <div className="containerPendingClients">
          <div className="headingPendingClients">
            Pending client invitations
          </div>
          <div className={'scrollbarPendingClient wrapPendingClient'}>
            {
              _.isEmpty(PendingClients)
                ? <EmptyPendingDetails isFetching={isFetching} />
                : PendingClients
            }
          </div>
        </div>
      </Paper>
    )
  }
}

export default connect(
  ({ clientList }) => ({ clientList }),
  { resendInvitation: _resendInvitation }
)(PendingClient)

PendingClient.propTypes = {
  clientList: PropTypes.object.isRequired,
  resendInvitation: PropTypes.func.isRequired
}

function EmptyPendingDetails() {
  return (
    <div>
      <div className="emptyClientsTextPendingClients">
        You currently have no pending client invitations.
        Click the plus sign to invite a new client by email.
      </div>
      <div className="addClientPendingClients">
        <AddClient />
      </div>
    </div>
  )
}
