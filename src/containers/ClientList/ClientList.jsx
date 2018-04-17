import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress'
import moment from 'moment';
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import breakPoints from '!!sass-variable-loader!./../../styles/variables/breakpoints.scss';
import { Link } from 'react-router';

import { redirectToProfile } from '../../libs/helpers/redirect';
import UserAvatar from '../../components/UserAvatar';
import alert from '../../components/Modal/CancelModal';
import SortableColumnHeading from '../../components/SortableColumnHeading';
import {
  CLIENT_NAME,
  THIS_WEEK,
  TIME_SPENT,
  LAST_SESSION,
  CLIENT_SINCE,
  STATUS,
  ACCEPTED,
  INVITED,
  DENIED,
  ARCHIVED,
  STOPPED
} from '../../libs/helpers/clientList'
import Icon from '../../components/Icon';
// import CheckBox from '../../components/CheckBox';
import {
  getClientsList as _getClientsList,
  setSortByColumn as _setSortByColumn,
  resendInvitation as _resendInvitation,
  cancelInvitation as _cancelInvitation,
  archiveUnarchive as _archiveUnarchive,
  RESEND_INVITATION_START,
  RESEND_INVITATION_END,
  CANCEL_INVITATION_START,
  CANCEL_INVITATION_END
} from '../../redux/modules/clientList'
import ClientActionButton, {
  ARCHIVE_CLIENT,
  UNARCHIVE_CLIENT,
  RESEND_INVITATION,
  CANCEL_INVITATION
} from '../../components/ClientActionButton';

import './ClientList.scss'

const clientActionToLabelMap = {
  [RESEND_INVITATION_END]: 'Successfully Sent',
  [CANCEL_INVITATION_END]: 'Successfully Cancelled'
}

const statusToActionLinkMap = {
  [ACCEPTED](id, clientAction) {
    if (clientAction)
      return <Link className="hyperTextClientList" style={{ marginTop: 2 }}>Please wait...</Link>
    return (
      <Link
        to={`/client/${id}`}
        className="hyperLinkClientList"
      >
        View profile
      </Link>
    );
  },
  [ARCHIVED](id, clientAction) {
    return <div className="hyperTextClientList">Archived</div>
  },
  [INVITED](id, clientAction, nonMuser) {
    const { resendInvitation } = this.props;
    if (clientAction) {
      let listActionStatus = 'Please wait...';
      if (clientAction === RESEND_INVITATION_END)
        listActionStatus = 'Invite sent';
      else if (clientAction === CANCEL_INVITATION_END)
        listActionStatus = 'Invite cancelled';
      return (
        <Link className="hyperTextClientList" style={{ marginTop: 2 }}>
          {listActionStatus}
        </Link>
      );
    }
    return <Link onClick={() => resendInvitation(id, nonMuser)} className="hyperLinkClientList">Re-send Invite</Link>
  },
  [STOPPED](stopped_date) {
    return <div className="hyperTextClientList">{`Stopped sharing on ${moment(stopped_date).format('MMMM D, YYYY')}`}</div>
  },
  [DENIED](declined_date) {
    return <div className="hyperTextClientList">{`Declined on ${moment(declined_date).format('MMMM D, YYYY')}`}</div>
  }
}

function renderListSeparator(thin) {
  return <Divider style={{ backgroundColor: styleVariables.lightestGrey, height: thin ? 1 : 2 }} />;
}

function renderNameAvatar(user, portable) {
  const {
    id,
    first_name,
    last_name,
    email,
    status,
    stopped_date,
    declined_date,
    nonMuser,
    __clientAction
  } = user;

  if (portable)
    return (
      <div>
        <UserAvatar style={{ marginRight: 18 }} size={30} fontSize={12} user={user} />
        <div className="clientListTextMainSmall">
          {status === ACCEPTED || status === ARCHIVED ? `${first_name} ${last_name}` : email}<br />
          {
            statusToActionLinkMap[status].bind(this)(
              status === STOPPED ? stopped_date : status === DENIED ? declined_date : id,
              __clientAction,
              nonMuser
            )
          }
        </div>
      </div>
    );
  return (
    <div>
      <UserAvatar style={{ marginRight: 18 }} size={30} fontSize={12} user={user} />
      <div
        className={
          status === ARCHIVED || status === STOPPED || status === DENIED ?
            'clientListTextMainLight' :
            'clientListTextMain'
        }
      >
        <abbr title={email}>{status === ACCEPTED || status === ARCHIVED ? `${first_name} ${last_name}` : email}</abbr>
      </div>
    </div>
  );
}

function renderStoppedSharingLabel(stopped_date, style) {
  return (
    <div style={style}>
      <div className="clientListTextSmall">{`Stopped sharing on ${moment(stopped_date).format('MMMM D, YYYY')}`}</div>
    </div>
  );
}

function renderDeclinedLabel(declined_date, style) {
  return (
    <div style={style}>
      <div className="clientListTextSmall">{`Declined on ${moment(declined_date).format('MMMM D, YYYY')}`}</div>
    </div>
  );
}

const renderSessions = {
  [ACCEPTED]: sessions_number => (
    <div className="clientListTextSmall">
      {
        sessions_number === 1 ?
          '1 session' :
          `${sessions_number} sessions`
      }
    </div>
  ),
  [INVITED]: cancelled => <div className="clientListTextSmall">{cancelled ? 'Invitation cancelled' : 'Invitation pending'}</div>,
  [ARCHIVED]: () => <div className="clientListTextSmallLight">Archived</div>,
  [STOPPED]: () => <div className="clientListTextSmallLight">Stopped</div>,
  [DENIED]: () => <div className="clientListTextSmallLight">Declined</div>
}

function renderActionMenu(id, status, clientAction, nonMuser) {
  const {
    resendInvitation,
    cancelInvitation,
    archiveUnarchive
  } = this.props;
  return (
    <IconMenu
      onClick={e => e.stopPropagation()}
      iconButtonElement={
        <IconButton
          style={{ padding: 0, height: 30, width: 30 }}
          iconStyle={{ width: 4, height: 16 }}
        >
          <Icon name="more-options-reversed-icon" fill={styleVariables.mediumGrey} />
        </IconButton>
      }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {
        status === ACCEPTED &&
        <MenuItem
          primaryText="View profile"
          style={{ fontSize: 14 }}
          onClick={() => redirectToProfile(id)}
        />
      }
      {
        status === ACCEPTED &&
        <MenuItem
          disabled={!!(clientAction)}
          primaryText="Archive client"
          style={{ fontSize: 14 }}
          onClick={() => archiveUnarchive(id, false)}
        />
      }
      {
        status === ARCHIVED &&
        <MenuItem
          disabled={!!(clientAction)}
          primaryText="Unarchive client"
          style={{ fontSize: 14 }}
          onClick={() => archiveUnarchive(id, true)}
        />
      }
      {
        status === INVITED && [
          <MenuItem
            disabled={clientAction && clientAction !== CANCEL_INVITATION_END}
            key="resend"
            primaryText="Re-send invitation"
            style={{ fontSize: 14 }}
            onClick={() => resendInvitation(id, nonMuser)}
          />,
          <MenuItem
            disabled={clientAction && clientAction !== RESEND_INVITATION_END}
            key="cancel"
            primaryText="Cancel invitation"
            style={{ fontSize: 14 }}
            onClick={() => alert('Are you sure that you want to cancel this invitation?')
              .then(() => cancelInvitation(id, nonMuser))
              .catch(() => { })
            }
          />
        ]
      }
    </IconMenu>
  );
}

function setWeekdayOrder(displayList) {
  if (this.state.dateAlphabets)
    return;
  const validSessionIndex = _.findIndex(displayList, ({ session_days }) => session_days);
  if (validSessionIndex !== -1) {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const days = displayList[validSessionIndex].session_days;
    const dates = _.keys(days).sort((a, b) => new Date(a) - new Date(b));
    this.setState({
      dateAlphabets: dates.map(date => ({ alphabet: dayNames[(new Date(date)).getDay()], date }))
    })
  }
}

function weekdayOrder(a, b) {
  const _a = this.state.dateAlphabets &&
    this.state.dateAlphabets.findIndex(dateAlphabet => dateAlphabet.date === a[0]);
  const _b = this.state.dateAlphabets &&
    this.state.dateAlphabets.findIndex(dateAlphabet => dateAlphabet.date === b[0]);

  return _a - _b;
}

function renderWeekDays(days) {
  return (
    <div style={{ marginTop: 4 }}>
      {
        _.entries(days).sort(this.weekdayOrder).map(day => (day[1] ?
          <Icon key={day[0]} name="dot" style={{ height: 16, width: 16 }} fill={styleVariables.cyan} stroke={styleVariables.lightGrey} /> :
          <Icon key={day[0]} name="dot" style={{ height: 16, width: 16 }} fill="none" stroke={styleVariables.lightGrey} />
        ))
      }
    </div>
  )
}

function renderPortableWeekdays(session_days, dateAlphabets, style) {
  return (
    <div style={style}>
      <div style={{ marginLeft: 6 }}>
        {
          dateAlphabets.map(date => (
            <span key={date.date} className="clientListTextSmallerLight" style={{ marginRight: 8 }}>{date.alphabet}</span>)
          )
        }
      </div>
      {this.renderWeekDays(session_days)}
    </div>
  )
}

function handleRightToggle(itemId) {
  this.setState({
    expandedItem: this.state.expandedItem === itemId ? -1 : itemId
  });
}

function portableListToggle(reverse, handleTouchTap) {
  return (
    <IconButton
      style={{
        backgroundColor: styleVariables.background,
        height: 70,
        width: 70,
        marginRight: -4
      }}
      iconStyle={{ width: 14, height: 14 }}
      onClick={handleTouchTap}
    >
      <Icon name={reverse ? 'chevron-up' : 'chevron-down'} />
    </IconButton>
  )
}

function renderSortableColumnHeading(columnValue, columnLabel, firstColumn) {
  const { setSortByColumn, clientList: { sortByColumn, reverse } } = this.props;
  const isSortColumn = sortByColumn === columnValue;

  return (
    <SortableColumnHeading
      columnLabel={columnLabel}
      onClick={() => setSortByColumn(columnValue)}
      isSortColumn={isSortColumn}
      reverse={reverse}
      style={{ paddingLeft: 8, paddingRight: 8, marginLeft: firstColumn ? 56 : 0 }}
    />
  );
}

function renderClient(client) {
  const {
    id,
    status,
    sessions_number,
    session_minutes_total,
    session_days,
    last_session,
    accepted_date,
    archived_date,
    stopped_date,
    date,
    declined_date,
    __clientAction,
    nonMuser
  } = client;
  const {
    windowDimension: {
      innerWidth
    },
    cancelInvitation,
    resendInvitation,
    archiveUnarchive
  } = this.props;

  const dateAlphabets = this.state.dateAlphabets || [{
    alphabet: 'S',
    date: 'Sun'
  }, {
    alphabet: 'M',
    date: 'Mon'
  }, {
    alphabet: 'T',
    date: 'Tue'
  }, {
    alphabet: 'W',
    date: 'Wed'
  }, {
    alphabet: 'T',
    date: 'Thu'
  }, {
    alphabet: 'F',
    date: 'Fri'
  }, {
    alphabet: 'S',
    date: 'Sat'
  }];
  const isOpen = this.state.expandedItem === id;
  if (innerWidth > parseInt(breakPoints.breakPointSm, 10))
    return (
      <Paper
        rounded={false}
        key={id}
        onClick={() => status === ACCEPTED && redirectToProfile(id)}
      >
        <ListItem
          disableTouchRipple
          style={{ backgroundColor: 'white', paddingRight: 0, height: 60 }}
        >
          {/* Avatar and Name */}
          <div style={{ width: '30%', float: 'left' }}>
            {this.renderNameAvatar(client)}
          </div>

          {/* Status */}
          <div style={{ width: '16%', float: 'left', marginTop: 0 }}>
            <div className="clientListTextSmall">
              {status === ACCEPTED &&
                <div>
                  Active<br />
                  <span style={{ fontSize: 12, opacity: .6 }}>since {moment(accepted_date).format('MMMM D, YYYY')}</span>
                </div>
              }
              {status === STOPPED &&
                <div>
                  Stopped sharing<br />
                  <span style={{ fontSize: 12, opacity: .6 }}>since {moment(date).format('MMMM D, YYYY')}</span>
                </div>
              }
              {status === INVITED &&
                <div style={{ marginTop: -6 }}>
                  Pending invitation<br />
                  <span style={{ fontSize: 12, opacity: .6 }}>since {moment(date).format('MMMM D, YYYY')}</span><br />
                  <span style={{ fontSize: 12, opacity: .6 }}>{nonMuser ? 'Needs a Muse account' : 'Has a Muse account'}</span>
                </div>
              }
              {status === ARCHIVED &&
                <div>
                  Archived<br />
                  <span style={{ fontSize: 12, opacity: .6 }}>since {moment(archived_date).format('MMMM D, YYYY')}</span>
                </div>
              }
            </div>
          </div>

          {/* Weekdays */}
          <div style={{ width: '16%', float: 'left', marginTop: 4 }}>
            {status === ACCEPTED &&
              this.renderWeekDays(session_days)
            }
          </div>

          {/* Time spent */}
          <div style={{ width: '12%', float: 'left', marginTop: 10 }}>
            {status === ACCEPTED &&
              session_minutes_total !== undefined &&
              <div className="clientListTextSmall">
                {session_minutes_total === 1 ? '1 minute' : `${session_minutes_total} minutes`}
              </div>
            }
          </div>

          {/* Last session */}
          <div style={{ width: '16%', float: 'left', marginTop: 10 }}>
            {status === ACCEPTED && last_session &&
              <div className="clientListTextSmall">{moment(last_session).format('MMMM D, YYYY')}</div>
            }
          </div>

          {/* Actions */}
          <div style={{ width: '4%', float: 'right' }}>
            {
              status !== STOPPED && status !== DENIED &&
              this.renderActionMenu(id, status, __clientAction, nonMuser)
            }
          </div>
        </ListItem>
        {renderListSeparator()}
      </Paper>
    );

  let previewItems = null;
  if (status === ACCEPTED)
    previewItems = this.renderPortableWeekdays(session_days, dateAlphabets, { float: 'left' })
  else if (status === INVITED)
    previewItems = (
      <div className="ActionsContainerClientList">
        {
          __clientAction === RESEND_INVITATION_START ||
            __clientAction === CANCEL_INVITATION_END ?
            <ClientActionButton
              disabled={__clientAction && __clientAction !== CANCEL_INVITATION_END}
              disabledLabel={clientActionToLabelMap[__clientAction]}
              hide={
                __clientAction &&
                __clientAction !== RESEND_INVITATION_START &&
                __clientAction !== RESEND_INVITATION_END &&
                __clientAction !== CANCEL_INVITATION_END
              }
              style={{ float: 'left' }}
              type={RESEND_INVITATION}
              onPress={() => resendInvitation(id, nonMuser)}
            /> :
            <ClientActionButton
              disabled={__clientAction && __clientAction !== RESEND_INVITATION_END}
              disabledLabel={clientActionToLabelMap[__clientAction]}
              hide={
                __clientAction &&
                __clientAction !== CANCEL_INVITATION_START &&
                __clientAction !== CANCEL_INVITATION_END &&
                __clientAction !== RESEND_INVITATION_END
              }
              style={{ float: 'left' }}
              type={CANCEL_INVITATION}
              onPress={() => alert('Are you sure that you want to cancel this invitation?')
                .then(() => cancelInvitation(id, nonMuser))
                .catch(() => { })
              }
            />
        }
      </div>
    )
  else if (status === ARCHIVED)
    previewItems = (
      <div style={{ float: 'left' }}>
        <ClientActionButton
          disabled={!!(__clientAction)}
          type={UNARCHIVE_CLIENT}
          onPress={() => archiveUnarchive(id, true)}
        />
      </div>
    )
  const showNestedItems = !!(
    status === ACCEPTED || (
      status !== DENIED &&
      status !== STOPPED &&
      innerWidth <= parseInt(breakPoints.breakPointXs, 10)
    )
  );

  return (
    <Paper rounded={false} key={id} style={{ marginBottom: isOpen ? 20 : 0 }}>
      <ListItem
        disabled
        style={{
          backgroundColor: 'white',
          paddingTop: 20,
          paddingBottom: 20,
          paddingRight: 0,
          height: 30
        }}
        innerDivStyle={{ paddingRight: 0, paddingTop: 20 }}
        rightIconButton={
          showNestedItems ?
            portableListToggle(isOpen, () => this.handleRightToggle(id)) :
            null}
        nestedListStyle={{ paddingTop: 2, paddingBottom: 0 }}
        open={isOpen}
        nestedItems={
          !showNestedItems ?
            [] : [
              /* Row 1 (only ACCEPTED clients) */
              status === ACCEPTED ?
                <ListItem
                  disabled
                  key={1}
                  style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingRight: 34, margin: 0 }}
                >
                  <div className="clientListTextSmallLight">Sessions this week</div>
                  <div style={{ float: 'right' }}>{renderSessions[status](sessions_number)}</div>
                </ListItem> :
                null,
              status === ACCEPTED ?
                <ListItem key={1.5} innerDivStyle={{ backgroundColor: 'white', margin: 0, paddingTop: 0, paddingBottom: 0 }}>
                  {renderListSeparator(true)}
                </ListItem> :
                null,

              /* Row 2 (only ACCEPTED clients) */
              status === ACCEPTED && innerWidth < parseInt(breakPoints.breakPointXs, 10) ?
                <ListItem
                  disabled
                  key={2}
                  style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingRight: 34, margin: 0 }}
                >
                  <div className="clientListTextSmallLight">Last 7 Days</div>
                  {this.renderPortableWeekdays(session_days, dateAlphabets, { float: 'right', marginTop: -10, marginRight: -6 })}
                </ListItem>
                :
                null,
              status === ACCEPTED && innerWidth < parseInt(breakPoints.breakPointXs, 10) ?
                <ListItem key={2.5} innerDivStyle={{ backgroundColor: 'white', margin: 0, paddingTop: 0, paddingBottom: 0 }}>
                  {renderListSeparator(true)}
                </ListItem>
                :
                null,

              /* Row 3 (only ACCEPTED clients) */
              status === ACCEPTED ?
                <ListItem
                  disabled
                  key={3}
                  style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingRight: 34, margin: 0 }}
                >
                  <div className="clientListTextSmallLight">Total Time Spent</div>
                  <div style={{ float: 'right' }}>
                    <div className="clientListTextSmall">{session_minutes_total === 1 ? '1 minute' : `${session_minutes_total} minutes`}</div>
                  </div>
                </ListItem>
                :
                null,
              status === ACCEPTED ?
                <ListItem key={3.5} innerDivStyle={{ backgroundColor: 'white', margin: 0, paddingTop: 0, paddingBottom: 0 }}>
                  {renderListSeparator(true)}
                </ListItem>
                :
                null,

              /* Row 4 (only ACCEPTED clients) */
              status === ACCEPTED && last_session ?
                <ListItem
                  disabled
                  key={4}
                  style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingRight: 34, margin: 0 }}
                >
                  <div className="clientListTextSmallLight">Last Session</div>
                  <div style={{ float: 'right' }}>
                    <div className="clientListTextSmall">{moment(last_session).format('MMMM D, YYYY')}</div>
                  </div>
                </ListItem>
                :
                null,
              status === ACCEPTED ?
                <ListItem key={4.5} innerDivStyle={{ backgroundColor: 'white', margin: 0, paddingTop: 0, paddingBottom: 0 }}>
                  {renderListSeparator(true)}
                </ListItem>
                :
                null,

              /* Row 5 (only ACCEPTED clients) */
              status === ACCEPTED ?
                <ListItem
                  disabled
                  key={5}
                  style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingRight: 34, margin: 0 }}
                >
                  <div className="clientListTextSmallLight">Client Since</div>
                  <div style={{ float: 'right' }}>
                    <div className="clientListTextSmall">{moment(accepted_date).format('MMMM D, YYYY')}</div>
                  </div>
                </ListItem>
                :
                null,
              status === ACCEPTED ?
                <ListItem key={5.5} innerDivStyle={{ backgroundColor: 'white', margin: 0, paddingTop: 0, paddingBottom: 0 }}>
                  {renderListSeparator(true)}
                </ListItem>
                :
                null,


              /* Row 6 */
              <ListItem
                disabled
                key={6}
                className="clearfix"
                style={{ minHeight: 32, backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, paddingRight: 34, margin: 0 }}
              >
                <div>
                  {
                    status !== ACCEPTED ?
                      /*
                    <div style={{ float: 'right' }}>
                      {
                        status !== STOPPED && status !== DENIED &&
                        this.renderActionMenu(id, status, __clientAction)
                      }
                    </div>
                        */
                      previewItems :
                      <div style={{ float: 'left' }}>
                        <ClientActionButton
                          disabled={!!(__clientAction)}
                          type={ARCHIVE_CLIENT}
                          onPress={() => archiveUnarchive(id, false)}
                        />
                      </div>
                  }
                </div>
              </ListItem>
            ]}
      >
        {/* leftCheckbox={
          innerWidth > parseInt(breakPoints.breakPointXs, 10) ?
            <CheckBox style={{ marginTop: 16 }} /> :
            null
        } */}

        <div
          style={{
            float: 'left',
            width: innerWidth > parseInt(breakPoints.breakPointXs, 10) ?
              '40%' :
              `calc(100% - ${showNestedItems ? '60px' : '0px'})`
          }}
        >
          {this.renderNameAvatar(client, true)}
        </div>
        {innerWidth > parseInt(breakPoints.breakPointXs, 10) ? previewItems : null}
        {
          /*
          innerWidth > parseInt(breakPoints.breakPointXs, 10) &&
          <div style={{ float: 'right', marginRight: showNestedItems ? 90 : 20 }}>
            {
              status !== STOPPED && status !== DENIED &&
              this.renderActionMenu(id, status, __clientAction)
            }
          </div>
        */
        }
      </ListItem>
      {renderListSeparator()}
    </Paper >
  )
}

export class ClientList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateAlphabets: null
    }
    this.setWeekdayOrder = setWeekdayOrder.bind(this);
    this.weekdayOrder = weekdayOrder.bind(this);
    this.renderClient = renderClient.bind(this);
    this.renderNameAvatar = renderNameAvatar.bind(this);
    this.renderWeekDays = renderWeekDays.bind(this);
    this.renderActionMenu = renderActionMenu.bind(this);
    this.renderPortableWeekdays = renderPortableWeekdays.bind(this);
    this.handleRightToggle = handleRightToggle.bind(this);
    this.renderSortableColumnHeading = renderSortableColumnHeading.bind(this)
  }
  componentWillMount() {
    const { getClientsList } = this.props
    getClientsList(true)
  }
  componentWillReceiveProps(nextProps) {
    this.setWeekdayOrder(nextProps.clientList.displayList)
  }
  render() {
    const { clientList } = this.props
    const dateAlphabets = this.state.dateAlphabets || [{
      alphabet: 'S',
      date: 'Sun'
    }, {
      alphabet: 'M',
      date: 'Mon'
    }, {
      alphabet: 'T',
      date: 'Tue'
    }, {
      alphabet: 'W',
      date: 'Wed'
    }, {
      alphabet: 'T',
      date: 'Thu'
    }, {
      alphabet: 'F',
      date: 'Fri'
    }, {
      alphabet: 'S',
      date: 'Sat'
    }];
    return (
      <div>
        <div style={{ height: 20 }} className="desktopOnly">
          <div style={{ width: 'calc(30% - 3px)', float: 'left', marginTop: -10 }}>
            {this.renderSortableColumnHeading(CLIENT_NAME, 'Client Name', true)}
          </div>
          <div style={{ width: 'calc(16% + 11px)', float: 'left', marginTop: -10 }}>
            {this.renderSortableColumnHeading(STATUS, 'Status')}
          </div>
          <div className="clientListTextSmallerLight" style={{ width: 'calc(16% - 20px)', float: 'left' }}>
            {
              dateAlphabets.map(date => (
                <span key={date.date} style={{ marginRight: 8 }}>{date.alphabet}</span>)
              )
            }
          </div>
          <div style={{ width: 'calc(12% - 1px)', float: 'left', marginTop: -10 }}>
            {this.renderSortableColumnHeading(TIME_SPENT, 'Time Spent')}
          </div>
          <div style={{ width: 'calc(16% - 5px)', float: 'left', marginTop: -10 }}>
            {this.renderSortableColumnHeading(LAST_SESSION, 'Last Session')}
          </div>
          <div className="clientListTextSmallLight" style={{ width: 'calc(4%)', marginRight: 40, float: 'right' }}>
            Actions
          </div>
        </div>
        {
          clientList.clients && clientList.clients.isFetching &&
          <Paper rounded={false} style={{ textAlign: 'center', backgroundColor: 'white', padding: '30px 0px' }}>
            <CircularProgress size={30} />
          </Paper>
        }
        {
          (
            clientList.clients &&
            !clientList.clients.isFetching &&
            _.isEmpty(clientList.displayList)
          ) ?
            <Paper rounded={false} style={{ backgroundColor: 'white', padding: '30px 0', color: '#4a4a4a', textAlign: 'center' }}>
              No Results Found
            </Paper> :
            <List style={{ padding: 0 }}>
              {!clientList.clients.isFetching && clientList.displayList.map(this.renderClient)}
            </List>
        }
      </div>
    )
  }
}

ClientList.propTypes = {
  clientList: PropTypes.object.isRequired,
  getClientsList: PropTypes.func.isRequired
}
renderSessions.ACCEPTED.propTypes = {
  sessions_number: PropTypes.number
}
renderSessions.ACCEPTED.defaultProps = {
  sessions_number: 0
}

export default connect(
  ({ clientList, windowDimension }) => ({ clientList, windowDimension }), {
    getClientsList: _getClientsList,
    setSortByColumn: _setSortByColumn,
    resendInvitation: _resendInvitation,
    cancelInvitation: _cancelInvitation,
    archiveUnarchive: _archiveUnarchive
  }
)(ClientList)
