import { Action } from 'redux';
import { Observable } from 'rxjs';

import * as qs from 'qs';

import { Async, Error, NetworkError, networkError } from './util/types';
import { fetch } from './util/rpc';

// Models.
type GameRating = {
  games: number;
  prog: number;
  prov: boolean;
  rating: number;
  rd: number;
};

export type NowPlayingGame = {
  color: 'white' | 'black';
  fen: string;
  fullId: string;
  gameId: string;
  isMyTurn: boolean;
  lastMove: string;
  opponent: {
    id: string;
    username: string;
    rating: number;
  };
  perf: string;
  rated: boolean;
  secondsLeft: number | null;
  speed: string;
  variant: {
    key: string;
    name: string;
  };
};

export type User = {
  createdAt: number;
  id: string;
  language?: string;
  profile?: Partial<{
    bio: string;
    country: string;
    firstName: string;
    lastName: string;
    location: string;
  }>;
  nowPlaying: NowPlayingGame[];
  online: boolean;
  perfs: {
    blitz: GameRating;
    bullet: GameRating;
    classical: GameRating;
    correspondence: GameRating;
    rapid: GameRating;
  };
  playTime: {
    total: 0;
    tv: 0;
  };
  seenAt: number;
  username: string;
};

export type UserState = Readonly<Async<User | null, LoginError | NotLoggedInError | NetworkError>>;

// Errors.
export type NotLoggedInError = Error<'AUTHENTICATION_REQUIRED', 'Must be logged in to do this.'>;

export function notLoggedInError(details: {}): NotLoggedInError {
  return { error: 'AUTHENTICATION_REQUIRED', reason: 'Must be logged in to do this.', details };
}

export type LoginError = Error<'AUTHENTICATION_FAILED', 'Incorrect username or password.'>;

export function loginError(details: {}): LoginError {
  return { error: 'AUTHENTICATION_FAILED', reason: 'Incorrect username or password.', details };
}

// Actions.
export type LoadUser = { type: 'LOAD_USER' };
type LoadUserSucceeded = { type: 'LOAD_USER_SUCCEEDED'; user: User };
type LoadUserFailed = { type: 'LOAD_USER_FAILED'; error: NotLoggedInError | NetworkError };

export type Login = { type: 'LOG_IN'; username: string; password: string };
type LoginSucceeded = { type: 'LOG_IN_SUCCEEDED'; user: User };
type LoginFailed = { type: 'LOG_IN_FAILED'; error: LoginError | NetworkError };

export type Logout = { type: 'LOG_OUT' };
type LogoutSucceeded = { type: 'LOG_OUT_SUCCEEDED' };
type LogoutFailed = { type: 'LOG_OUT_FAILED'; error: NetworkError };

export type UserAction =
  | LoadUser
  | LoadUserSucceeded
  | LoadUserFailed
  | Login
  | LoginSucceeded
  | LoginFailed
  | Logout
  | LogoutSucceeded
  | LogoutFailed;

export function loadUser(): LoadUser {
  return { type: 'LOAD_USER' };
}

function loadUserSucceeded(user: User): LoadUserSucceeded {
  return { type: 'LOAD_USER_SUCCEEDED', user };
}

function loadUserFailed(error: NotLoggedInError | NetworkError): LoadUserFailed {
  return { type: 'LOAD_USER_FAILED', error };
}

export function login(username: string, password: string): Login {
  return { type: 'LOG_IN', username, password };
}

function loginSucceeded(user: User): LoginSucceeded {
  return { type: 'LOG_IN_SUCCEEDED', user };
}

function loginFailed(error: LoginError | NetworkError): LoginFailed {
  return { type: 'LOG_IN_FAILED', error };
}

export function logout(): Logout {
  return { type: 'LOG_OUT' };
}

function logoutSucceeded(): LogoutSucceeded {
  return { type: 'LOG_OUT_SUCCEEDED' };
}

function logoutFailed(error: NetworkError): LogoutFailed {
  return { type: 'LOG_OUT_FAILED', error };
}

// Reducer.
export function userReducer(state: UserState | undefined, action: UserAction): UserState {
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
  return Observable.merge(
    loadUserEpic(action$.filter((action: Action): action is LoadUser => action.type === 'LOAD_USER')),
    loginEpic(action$.filter((action: Action): action is Login => action.type === 'LOG_IN')),
    logoutEpic(action$.filter((action: Action): action is Logout => action.type === 'LOG_OUT')),
  );
}
