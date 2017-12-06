import { Observable } from 'rxjs';

import { Action } from '../';
import { fetch } from '../util/rpc';

import {
  LoadUser,
  LoadUserSucceeded,
  loadUserSucceeded,
  LoadUserFailed,
  loadUserFailed,
  Login,
  LoginSucceeded,
  loginSucceeded,
  LoginFailed,
  loginFailed,
  Logout,
  LogoutSucceeded,
  logoutSucceeded,
  LogoutFailed,
  logoutFailed,
} from './actions';
import { UserState, notLoggedInError, loginError } from './models';

import { userReady } from '../lobby';

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
    '/api/account/info',
    action => ({}),
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
    '/api/login',
    action => ({
      method: 'POST',
      body: {
        username: action.username,
        password: action.password,
      },
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
  return fetch('/api/logout', action => ({}), res => {}, logoutSucceeded, logoutFailed, action$);
}

export function userEpic(action$: Observable<Action>): Observable<Action> {
  const userReadyEpics = Observable.merge(
    loadUserEpic(action$.filter((action: Action): action is LoadUser => action.type === 'LOAD_USER')),
    loginEpic(action$.filter((action: Action): action is Login => action.type === 'LOG_IN')),
  );
  return Observable.merge(
    userReadyEpics,
    userReadyEpics.mapTo(userReady()),
    logoutEpic(action$.filter((action: Action): action is Logout => action.type === 'LOG_OUT')),
  );
}
