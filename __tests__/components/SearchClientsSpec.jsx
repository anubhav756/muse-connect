import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { getMuiTheme } from 'material-ui/styles'
import AutoComplete from 'material-ui/AutoComplete'
import IconButton from 'material-ui/IconButton'
import SearchClientComponent from '../../src/components/SearchClients'
import SearchClients from '../../src/components/SearchClients/SearchClients'


const clientList = [{
  first_name: 'Gilbert',
  last_name: 'Blythe',
  weekly_shift: 0,
  last_session: '2017-08-01T15:36:39+00:00',
  sessions_last_week: [],
  muser_since: '2017-07-18T18:18:09.413150+00:00',
  avatar: '',
  user_id: '66384d5ec52942a4b2a105119b20d250',
  last_viewed_date: '2017-08-17T12:11:08.894560+00:00',
  email: 'ixmc1@mailinator.com',
  status: 'ACCEPTED',
  accepted_date: '2017-08-03T16:04:01.006320+00:00'
}]
const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const storeState = {
  clientList: {
    clients: {
      isFetching: false,
      isError: false,
      info: {}
    }
  }
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Component) SearchClient', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<SearchClientComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object,
      }
    })
  )

  const buildSearchBarWrapper = () => (
    mount(<SearchClients dataSource={[]} handleInputChange={() => {}} callBack={() => {}} />, {
      context: { muiTheme: getMuiTheme() },
      childContextTypes: {
        muiTheme: PropTypes.object,
      }
    })
  )
  describe('', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('should render SearchClients subcomponent', () => {
      wrapper.find(SearchClients).should.have.length(1)
    })
    it('initial state data source should be an empty array', () => {
      wrapper.find('SearchClientsWrapper').instance().state.dataSource.should.have.length(0)
      wrapper.find('SearchClientsWrapper').instance().state.pendingRequest.should.be.false()
    })
    it('as user start typing should make api request to fetch clients and set pending request state to true', () => {
      wrapper.find('SearchClients').getElement().props.handleInputChange()
      wrapper.update()
      wrapper.find('SearchClientsWrapper').instance().state.pendingRequest.should.be.true()
    })
    it('Should render AutoComplete', () => {
      wrapper.find(SearchClients).find(AutoComplete).should.have.length(1)
    })
    it('Should call onKeyUp of AutoComplete component', () => {
      wrapper.find(SearchClients).find(AutoComplete).getElement().props.onKeyUp({ keyCode: '13' })
    })
    it('Should call onNewRequest of AutoComplete component', () => {
      wrapper.find(SearchClients).find(AutoComplete).getElement().props.onNewRequest({ data: 'dummy' })
    })
    it('should generate data source as user start type', () => {
      storeState.clientList.clients.info.active_clients = clientList
      const context = getContext(storeState)
      wrapper.setContext(context)
      wrapper.setProps({
        rerender: true
      })
      wrapper.find('SearchClientsWrapper').instance().state.dataSource.should.have.length(1)
    })
    it('Should render Searchbar clear button and call clearQuery on touchtap of it', () => {
      const searchBarWrapper = buildSearchBarWrapper()
      searchBarWrapper.setState({ showClearButton: true })
      searchBarWrapper.find(IconButton).should.have.length(1)
      searchBarWrapper.find(IconButton).getElement().props.onClick()
    })
  })
})
