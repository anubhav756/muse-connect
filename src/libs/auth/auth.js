import Auth0Lock from 'auth0-lock';
import { browserHistory } from 'react-router'
import endPoints from '../../routes/endPoints'
import config from '../../config'

export default class Auth {

  constructor(warningModal = () => {}, lockOptions) {
    this.lock = new Auth0Lock(config.AUTH0.clientId, config.AUTH0.domain, {
      ...lockOptions,
      oidcConformant: true,
      auth: {
        responseType: 'token',
        audience: config.AUTH0.audience
      },
      theme: {
        logo: '/images/logo/widget_logo.png',
        primaryColor: '#28b5a2'
      },
      container: 'auth'
    });

    this.warningModal = warningModal
    this.handleAuthentication();
    // binds functions to keep this context
    this.init = this.init.bind(this);
  }

  init(authCallback, lockOptions = {}) {
    this.authCallback = authCallback;

    // Call the show method to display the widget.
    this.lock.show(lockOptions);
  }

  handleAuthentication() {
    // Add callback Lock's `authenticated` event
    this.lock.on('authenticated', this.setSession.bind(this));
    // Add callback for Lock's `authorization_error` event
    this.lock.on('authorization_error', (err) => {
      console.error(err);
      browserHistory.replace(endPoints.signin);
    });
  }

  setSession(authResult) {
    try {
      if (authResult && authResult.accessToken) {
        localStorage.clear() // clear the local storage
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        this.authCallback();
      }
    } catch (error) {
      this.warningModal();
    }
  }
}
