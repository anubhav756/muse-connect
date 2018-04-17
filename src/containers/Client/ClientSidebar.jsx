import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import Sidebar from '../../components/Sidebar';
import Icon from '../../components/Icon';
import endPoints from '../../routes/endPoints';
import { archiveUnarchive as _archiveUnarchive } from '../../redux/modules/clientList';
import alert from '../../components/Modal/CancelModal';
import './ClientSidebar.scss'

class ClientSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isArchiving: false
    };
  }
  render() {
    const {
      client: {
      info: {
        id,
      first_name: firstName,
      last_name: lastName,
      avatar: profile,
      accepted_date,
      muser_since,
      email
      },
      isFetching
    },
      archiveUnarchive
  } = this.props;
    const { isArchiving } = this.state;
    return (
      <Sidebar
        loading={isFetching}
        title="All Clients"
        backLink={endPoints.clients}
        user={{ firstName, lastName, profile }}
        userDetails={[{
          key: 0,
          label: <span className="emailClientSidebar"><a href={`mailto:${email}`}>{email}</a></span>
        },
        {
          key: 1,
          label: `Muser since ${moment(muser_since).format('MMMM YYYY')}`
        }, {
          key: 2,
          label: `Client since ${moment(accepted_date).format('MMMM D, YYYY')}`
        }]}
        userActionButtons={[{
          key: 0,
          label: isArchiving ? 'Please wait...' : 'Archive client',
          icon: <Icon
            name="archive-icon"
            fill={colors.lightGrey}
            style={{ height: 18, width: 18, marginBottom: -3, marginRight: 12 }}
          />,
          handleClick: () => {
            if (isArchiving)
              return;
            alert('Are you sure you want to archive this client?')
              .then(() => {
                this.setState({ isArchiving: true })
                archiveUnarchive(id, false, (err) => {
                  this.setState({ isArchiving: false });
                  if (!err)
                    browserHistory.push(endPoints.clients)
                })
              })
              .catch(() => { })
          }
        }]}
      />
    );
  }
}
ClientSidebar.propTypes = {
  client: PropTypes.object.isRequired,
  archiveUnarchive: PropTypes.func.isRequired
}

export default connect(({ client }) => ({
  client: client.client
}),
  ({ archiveUnarchive: _archiveUnarchive })
)(ClientSidebar);
