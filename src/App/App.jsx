import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import IdleTimer from 'react-idle-timer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import ReactGA from 'react-ga'
import config from '../config'

import Notice from '../components/Notice'
import styles from '../styles/styles'
import { setDimension } from '../redux/modules/windowDimension'
import { CancelModal } from '../components/Modal';
import IdleModal from '../components/IdleModal';
import ChatraWidget from '../components/ChatraWidget'
import CleverTap from '../components/CleverTapWrapper'
import ErrorBoundary from '../components/ErrorBoundary'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showIdleModal: false
    }
    this.updateDimensions = this.updateDimensions.bind(this)
    this.toggleIdleModal = this.toggleIdleModal.bind(this)
    this.handleIdleAction = this.handleIdleAction.bind(this)
  }

  componentWillMount() {
    // bind the window resize listener with the class instance variable
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentDidMount() {
    ReactGA.initialize(config.UTILITY.ga_id)
  }

  componentWillUnmount() {
    // unbind the window resize listener from class instance variable
    window.removeEventListener('resize', this.updateDimensions);
  }

  handleIdleAction() {
    if (localStorage.getItem('access_token')) {
      this.setState({ showIdleModal: true });
    }
  }

  toggleIdleModal() {
    const { showIdleModal } = this.state

    this.setState({ showIdleModal: !showIdleModal });
  }

  /*
   * @function updateDimensions dispatches the action and updates the window dimension at store
   * @memberOf App
   */
  updateDimensions() {
    const { store } = this.props
    store.dispatch(setDimension({ innerWidth: window.innerWidth, innerHeight: window.innerHeight }))
  }

  handleUpdate() {
    window.scrollTo(0, 0)
    ReactGA.pageview(window.location.pathname);
  }

  /*
   * @function 'get content' is a getter for variable content. Returns the Router
   * @readonly
   * @memberOf App
  */
  get content() {
    const { history, routes } = this.props
    const { showIdleModal } = this.state
    return (
      <IdleTimer
        idleAction={this.handleIdleAction}
        timeout={600000}
      >
        <div>
          <IdleModal
            open={showIdleModal}
            toggleModal={this.toggleIdleModal}
          />
          <ChatraWidget />
          <CleverTap />
          <CancelModal />
          <Router onUpdate={this.handleUpdate.bind(this)} history={history} >
            {routes}
          </Router>
          <Notice />
        </div>
      </IdleTimer>
    )
  }

  render() {
    const { store } = this.props
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <MuiThemeProvider muiTheme={getMuiTheme(styles)}>
            {
              this.content
            }
          </MuiThemeProvider>
        </Provider>
      </ErrorBoundary>
    )
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default App
