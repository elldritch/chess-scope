import { Observable } from 'rxjs';

import { Action } from '../';
import { noop } from '../util';
import { fetch } from '../util/rpc';

import {
  LoadUser,
  LoadUserFailed,
  loadUserFailed,
  loadUserSucceeded,
  LoadUserSucceeded,
  Login,
  LoginFailed,
  loginFailed,
  LoginSucceeded,
  loginSucceeded,
  Logout,
  LogoutFailed,
  logoutFailed,
  LogoutSucceeded,
  logoutSucceeded,
} from './actions';
import { loginError, notLoggedInError, UserState } from './models';

// Reducer.
export function userReducer(state: UserState | undefined, action: Action): UserState {
  if (!state) {
    return { loading: false, data: null, error: null };
  }

  switch (action.type) {
    case 'LOAD_USER':
      return { ...state, loading: true };
    case 'LOAD_USER_SUCCEEDED':
      return { loading: false, data: action.user, error: null };
    case 'LOAD_USER_FAILED':
      return { ...state, loading: false, error: action.error };

    case 'LOG_IN':
      return { ...state, loading: true };
    case 'LOG_IN_SUCCEEDED':
      return { loading: false, data: action.user, error: null };
    case 'LOG_IN_FAILED':
      return { ...state, loading: false, error: action.error };

    case 'LOG_OUT':
      return { ...state, loading: true };
    case 'LOG_OUT_SUCCEEDED':
      return { loading: false, data: null, error: null };
    case 'LOG_OUT_FAILED':
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}

// Effects.
export function loadUserEpic(action$: Observable<LoadUser>): Observable<LoadUserSucceeded | LoadUserFailed> {
  return fetch(
    () => '/api/account/info',
    () => ({}),
    res => {
      if (res.status === 401) {
        throw notLoggedInError(res);
      }
    },
    loadUserSucceeded,
    loadUserFailed,
    action$,
  );
}

export function loginEpic(action$: Observable<Login>): Observable<LoginSucceeded | LoginFailed> {
  return fetch(
    () => '/api/login',
    action => ({
      body: {
        username: action.username,
        password: action.password,
      },
      method: 'POST',
    }),
    res => {
      if (res.status === 401) {
        throw loginError(res);
      }
    },
    loginSucceeded,
    loginFailed,
    action$,
  );
}

export function logoutEpic(action$: Observable<Logout>): Observable<LogoutSucceeded | LogoutFailed> {
  return fetch(() => '/api/logout', () => ({}), noop, logoutSucceeded, logoutFailed, action$);
}

export function userEpic(action$: Observable<Action>): Observable<Action> {
  return Observable.merge(
    loadUserEpic(action$.filter((action: Action): action is LoadUser => action.type === 'LOAD_USER')),
    loginEpic(action$.filter((action: Action): action is Login => action.type === 'LOG_IN')),
    logoutEpic(action$.filter((action: Action): action is Logout => action.type === 'LOG_OUT')),
  );
}
