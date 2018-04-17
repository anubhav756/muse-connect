// imports
import _ from 'lodash';
import { notify } from './notice';
import { updateUser } from './user';
import _updateAccount, {
  updatePayment,
  getTransactions as _getTransactions
} from '../../containers/Account/api';
import getMeApi from '../../containers/SignIn/api';
import Auth0 from 'auth0-js';
import config from '../../config';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_TRANSACTIONS_START = 'GET_TRANSACTIONS_START';
export const GET_TRANSACTIONS_END = 'GET_TRANSACTIONS_END';
export const GET_TRANSACTIONS_ERROR = 'GET_TRANSACTIONS_ERROR';

const changeUserKey = {
  firstName: (info, value) => {
    const _info = info;
    _info.firstName = value;
    return _info;
  },
  lastName: (info, value) => {
    const _info = info;
    _info.lastName = value;
    return _info;
  },
  email: (info, value) => {
    const _info = info;
    _info.email = value;
    return _info;
  },
  displayName: (info, value) => {
    const _info = info;
    _info.displayName = value;
    return _info;
  },
  displayEmail: (info, value) => {
    const _info = info;
    _info.displayEmail = value;
    return _info;
  }
}

// ------------------------------------
// Actions
// ------------------------------------
function updateUserTemp(payload) {
  return (dispatch, getState) => {
    const userInfo = getState().user.info;
    const prevUserInfo = JSON.parse(JSON.stringify(userInfo));
    _.keys(payload).forEach(key => changeUserKey[key](userInfo, payload[key]));
    dispatch(updateUser(userInfo));
    return prevUserInfo;
  }
}

export function updateAccount(payload, done) {
  return (dispatch) => {
    const prevUser = dispatch(updateUserTemp(payload));
    _updateAccount(payload)
      .end((error, res) => {
        let newUser = prevUser;
        if (error) {
          dispatch(notify({ error }));
        } else
          newUser = res.body.data;
        dispatch(updateUser(newUser));
        done(error);
      })
  }
}

export function getTransactions() {
  return (dispatch, getState) => {
    const { account: { info: { nextURL } } } = getState();

    dispatch({ type: GET_TRANSACTIONS_START });
    _getTransactions(nextURL)
      .then((res) => {
        dispatch({ type: GET_TRANSACTIONS_END, payload: res.body });
      })
      .catch((error) => {
        console.error(error);
        dispatch(notify({ error }));
        dispatch({ type: GET_TRANSACTIONS_ERROR });
      });
  }
}

export function updatePaymentDetails(token) {
  return (dispatch) => {
    updatePayment(token)
      .then((res) => {
        dispatch(notify({ message: 'Payment details are updated.' }));
        getMeApi().then((res) => { dispatch(updateUser(res.body.me)); });
      })
      .catch((error) => {
        dispatch(notify({ error }))
      })
  }
}

export function resetPassword(email) {
  return (dispatch) => {
    const webAuth = new Auth0.WebAuth({
      domain: config.AUTH0.domain,
      clientID: config.AUTH0.clientId
    });

    webAuth.changePassword({
      connection: config.AUTH0.connection,
      email,
    }, (err) => {
      if (err) {
        console.error(err.message);
        dispatch(notify({ message: err.message }));
      } else {
        dispatch(notify({ message: 'An email has been sent to you to change your password.' }));
      }
    });
  }
}

// ------------------------------------
// Action handlers
// ------------------------------------
const initialState = {
  isFetching: false,
  isError: false,
  info: {}
};

const ACTION_HANDLERS = {
  [GET_TRANSACTIONS_START]: state => ({ ...state, isFetching: true }),
  [GET_TRANSACTIONS_END]: (state, { payload: { nextURL, transactions } }) => ({
    ...state,
    info: {
      transactions: (state.info.transactions || []).concat(transactions),
      nextURL
    },
    isFetching: false
  }),
  [GET_TRANSACTIONS_ERROR]: state => ({ ...state, isError: true })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function accountReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
