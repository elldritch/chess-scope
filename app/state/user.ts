import { Observable } from 'rxjs';
import { ActionsObservable, combineEpics } from 'redux-observable';

import * as qs from 'qs';

import { Async, Error, NetworkError, networkError } from '../types';

// Models.
type GameRating = {
  games: number;
  prog: number;
  prov: boolean;
  rating: number;
  rd: number;
};

export type Game = {
  id: string;
  variant: string;
  speed: string;
  perf: string;
  rated: boolean;
  opponent: {
    id: string;
    username: string;
    rating: number;
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
  nowPlaying: Game[];
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

// Actions.
export type LoadUser = { type: 'LOAD_USER' };
type LoadUserSucceeded = { type: 'LOAD_USER_SUCCEEDED'; user: User };
type LoadUserFailed = { type: 'LOAD_USER_FAILED'; error: NotLoggedInError | NetworkError };
type NotLoggedInError = Error<'AUTHENTICATION_REQUIRED', 'Must be logged in to do this.'>;
function notLoggedInError(details: {}): NotLoggedInError {
  return { error: 'AUTHENTICATION_REQUIRED', reason: 'Must be logged in to do this.', details };
}

export type Login = { type: 'LOG_IN'; username: string; password: string };
type LoginSucceeded = { type: 'LOG_IN_SUCCEEDED'; user: User };
type LoginFailed = { type: 'LOG_IN_FAILED'; error: LoginError | NetworkError };
type LoginError = Error<'AUTHENTICATION_FAILED', 'Incorrect username or password.'>;
function loginError(details: {}): LoginError {
  return { error: 'AUTHENTICATION_FAILED', reason: 'Incorrect username or password.', details };
}

export type Logout = { type: 'LOG_OUT' };
type LogoutSucceeded = { type: 'LOG_OUT_SUCCEEDED' };
type LogoutFailed = { type: 'LOG_OUT_FAILED', error: NetworkError };

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
export type UserState = Readonly<Async<User | null, LoginError | NotLoggedInError | NetworkError>>;

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
const loadUserEpic = (action$: Observable<LoadUser>): Observable<LoadUserSucceeded | LoadUserFailed> =>
  action$.switchMap(action =>
    Observable.from(
      window
        .fetch('/api/account/info', {
          method: 'GET',
          credentials: 'same-origin',
          headers: [['Accept', 'application/vnd.lichess.v1+json']],
        })
        .catch(err => {
          throw networkError(err);
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 401) {
            throw notLoggedInError(res);
          } else {
            throw networkError(res);
          }
        }),
    )
      .map(loadUserSucceeded)
      .catch(err => Observable.of(loadUserFailed(err))),
  );

const loginEpic = (action$: Observable<Login>): Observable<LoginSucceeded | LoginFailed> =>
  action$.switchMap(action =>
    Observable.from(
      window
        .fetch('/api/login', {
          method: 'POST',
          credentials: 'same-origin',
          body: qs.stringify({
            username: action.username,
            password: action.password,
          }),
          headers: [
            ['Accept', 'application/vnd.lichess.v1+json'],
            ['Content-Type', 'application/x-www-form-urlencoded'],
          ],
        })
        .catch(err => {
          throw networkError(err);
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 401) {
            throw loginError(res);
          } else {
            throw networkError(res);
          }
        }),
    )
      .map(loginSucceeded)
      .catch(err => Observable.of(loginFailed(err))),
  );

const logoutEpic = (action$: Observable<Logout>): Observable<LogoutSucceeded | LogoutFailed> =>
  action$.switchMap(action =>
    Observable.from(
      window
        .fetch('/api/logout', {
          method: 'GET',
          credentials: 'same-origin',
          headers: [
            ['Accept', 'application/vnd.lichess.v1+json'],
            ['Content-Type', 'application/x-www-form-urlencoded'],
          ],
        })
        .catch(err => {
          throw networkError(err);
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw networkError(res);
          }
        }),
    )
      .map(logoutSucceeded)
      .catch(err => Observable.of(logoutFailed(err))),
  );

export function userEpic(action$: Observable<UserAction>): Observable<UserAction> {
  return Observable.merge(
    loadUserEpic(action$.filter((action: UserAction): action is LoadUser => action.type === 'LOAD_USER')),
    loginEpic(action$.filter((action: UserAction): action is Login => action.type === 'LOG_IN')),
    logoutEpic(action$.filter((action: UserAction): action is Logout => action.type === 'LOG_OUT')),
  );
}
