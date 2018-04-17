import React from 'react';
import PropTypes from 'prop-types'
import { getMuiTheme } from 'material-ui/styles'

export function mockStore(dummyStore = {}, dispatch = {}) {
  return {
    getState: () => dummyStore,
    dispatch: () => dispatch,
    subscribe: () => {}
  }
}

export default function (dummyStore, dispatch) {
  return {
    context: {
      store: mockStore(dummyStore, dispatch),
      muiTheme: getMuiTheme(),
    },
    childContextTypes: {
      muiTheme: PropTypes.object,
      store: PropTypes.object
    }
  }
}
