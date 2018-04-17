import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash';
import MenuItem from 'material-ui/MenuItem'

import SearchClients from './SearchClients'
import { getClientsList as _getClientsList } from '../../redux/modules/clientList'
import ListItem from '../ClientListItem'
import { redirectToProfile } from '../../libs/helpers/redirect'
import { ACCEPTED } from '../../libs/helpers/clientList'

function handleSelect(value) {
  redirectToProfile(value.data && value.data.id)
}

export class SearchClientsWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      pendingRequest: false
    }
    this.handleSelect = handleSelect.bind(this)
    this.getClients = this.getClients.bind(this)
    this.createDataSource = this.createDataSource.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { clients: { info, isFetching, isError } } = nextProps;
    const { pendingRequest } = this.state;

    if (pendingRequest && !_.isEmpty(info) && !isFetching && !isError) {
      this.setState({ pendingRequest: false });
      this.createDataSource(info);
    }
  }

  // text, dataSource params to be used here
  onInputChange() {
    this.getClients()
  }

  getClients() {
    const { clients: { info, isFetching, isError }, getClientsList } = this.props;
    if (!_.isEmpty(info))
      return this.createDataSource(info);
    if (!isFetching && !isError)
      getClientsList();
    this.setState({ pendingRequest: true });
  }

  createDataSource(details = { active_clients: [] }) {
    const { active_clients: clients } = details
    const sourceItems = []
    clients.forEach((client) => {
      if (client.status === ACCEPTED) {
        sourceItems.push(
          {
            text: `${client.first_name} ${client.last_name}`,
            value: (<MenuItem
              primaryText={<ListItem
                heading={`${client.first_name} ${client.last_name}`}
                user={{
                  firstName: client.first_name,
                  lastName: client.last_name,
                  profile: client.avatar
                }}
                dividerStyle={{ marginTop: '25px' }}
              />}
            />),
            data: { id: client.id }
          }
        )
      }
    })
    this.setState({ dataSource: sourceItems })
  }

  render() {
    const { dataSource, pendingRequest } = this.state
    return (
      <SearchClients
        dataSource={dataSource}
        loading={pendingRequest}
        callBack={this.handleSelect}
        handleInputChange={this.onInputChange}
      />
    )
  }
}

export default connect(({ clientList: { clients } }) =>
  ({ clients }), { getClientsList: _getClientsList })(SearchClientsWrapper)

SearchClientsWrapper.propTypes = {
  clients: PropTypes.object.isRequired,
  getClientsList: PropTypes.func.isRequired
}
