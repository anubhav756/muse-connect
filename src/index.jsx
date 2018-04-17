import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import './styles/global.scss';
import './styles/fonts';
import makeRoutes from './routes'
import App from './App'
import CreateStore from './redux/store/CreateStore'

import { bindStore } from './libs/getStore'

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in src/redux/modules,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = {}
const store = CreateStore(initialState)
// gets the reference of store to storeRef varialble which can be accessed via getStore
bindStore(store)
const history = syncHistoryWithStore(browserHistory, store)

// Now that we have the Redux store, we can create our routes. We provide
// the store to the route definitions so that routes have access to it for
// hooks such as `onEnter`.
const routes = makeRoutes(store)

render(
  <AppContainer>
    <App store={store} history={history} routes={routes} />
  </AppContainer>, document.querySelector('#app')
)

if (module && module.hot) {
  module.hot.accept('./App', () => {
    const HmrApp = require('./App').default;
    render(
      <AppContainer>
        <HmrApp store={store} history={history} routes={routes} />
      </AppContainer>,
      document.querySelector('#app')
    )
  })
}
