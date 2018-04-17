import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Paper,
  Divider
} from 'material-ui';
import moment from 'moment';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import { secondsToMinutes } from '../../../libs/helpers/common';
import UserAvatar from '../../../components/UserAvatar';
import { ClientSessionChart } from '../../../components/Chart';
import { MOBILE_VIEW } from '../../../libs/helpers/windowDimension';
import './ClientSessionCard.scss'

function getFormattedDate(datetime) {
  return moment(datetime).format('MMMM D, YYYY').toUpperCase()
}

function ClientSessionCard({
  showDate,
  session,
  client: { info },
  wd,
  activeTime,
  neutralTime,
  calmTime
}) {
  const emptySession = !session || !session.completed_seconds;
  const noHeadband = session.no_headband;
  const totalTime = calmTime + activeTime + neutralTime;
  const calmPercent = Math.round((calmTime / totalTime) * 100)
  const neutralPercent = Math.round((neutralTime / totalTime) * 100)
  const activePercent = Math.round((activeTime / totalTime) * 100)
  if (emptySession)
    return (
      <div>
        {
          showDate && session && session.datetime &&
          <div className="LabelSessionCard">{getFormattedDate(session.datetime)}</div>
        }
        <Paper zDepth={0} rounded={false} style={{ background: 'white', marginTop: 18, padding: 20, paddingBottom: 28 }}>
          <UserAvatar style={{ float: 'left' }} />
          <div className="HeadingContainerClientSession">
            <div className="TextSessionCard">No sessions</div>
          </div>
        </Paper>
      </div>
    );

  return (
    <div>
      {
        showDate &&
        <div className="LabelSessionCard">{getFormattedDate(session.datetime)}</div>
      }
      <Paper rounded={false} style={{ background: 'white', marginTop: 18, padding: MOBILE_VIEW(wd) ? 10 : 20 }}>
        {
          !MOBILE_VIEW(wd) &&
          <UserAvatar user={info} style={{ float: 'left' }} />
        }
        <div className="HeadingContainerClientSession">
          <div className="TextSessionCard">{secondsToMinutes(session.completed_seconds, true)} session at {moment(session.datetime).format('h:mma')}</div>
          <div className="SubContainerSessionCard">
            <div className="SubTextSessionCard">Soundscape: {session.environment || '-'}</div>
            <div className="SubTextSessionCard">Exercise: {session.instructions}</div>
          </div>
        </div>
        <Divider
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: -20,
            marginRight: -20,
            background: colors.lightestGrey
          }}
        />
        {
          noHeadband ?
            <div className="NoSessionTextSessionCard">
              No headband worn for this session
            </div> :
            <div>
              <div className="RightDetailsSessionCard">
                <div className="ScoreContainerSessionCard">
                  <div className="HighlightSessionCard">{session.recovery_count || 0}</div>
                  <div className="SubHighlightSessionCard">recoveries</div>
                </div>
                <div className="ScoreContainerSessionCard">
                  <div className="HighlightSessionCard">{session.bird_count || 0}</div>
                  <div className="SubHighlightSessionCard">birds</div>
                </div>
              </div>
              <div className="LeftDetailsSessionCard">
                <div className="SmallHighlightSessionCard">{secondsToMinutes(activeTime)} ({activePercent}%)</div>
                <div className="SmallSubHighlightSessionCard">active</div>
                <div className="SmallHighlightSessionCard">{secondsToMinutes(neutralTime)} ({neutralPercent}%)</div>
                <div className="SmallSubHighlightSessionCard">neutral</div>
                <div className="SmallHighlightSessionCard">{secondsToMinutes(calmTime)} ({calmPercent}%)</div>
                <div className="SmallSubHighlightSessionCard">calm</div>
              </div>
              <ClientSessionChart style={{ overflow: 'hidden', height: MOBILE_VIEW(wd) ? 180 : 240 }} session={session} />
            </div>
        }
      </Paper>
    </div>
  );
}

ClientSessionCard.propTypes = {
  showDate: PropTypes.bool,
  session: PropTypes.object,
  client: PropTypes.object.isRequired,
  wd: PropTypes.object.isRequired,
  activeTime: PropTypes.number,
  neutralTime: PropTypes.number,
  calmTime: PropTypes.number
}
ClientSessionCard.defaultProps = {
  showDate: false,
  session: null,
  activeTime: 0,
  neutralTime: 0,
  calmTime: 0
}

export default connect(({ windowDimension: wd }) => ({ wd }))(ClientSessionCard);
