import { NetworkError } from '../util/types';
import { LoginError, NotLoggedInError, User } from './models';

export type LoadUser = {
  readonly type: 'LOAD_USER';
};
export type LoadUserSucceeded = {
  readonly type: 'LOAD_USER_SUCCEEDED';
  readonly user: User;
};
export type LoadUserFailed = {
  readonly type: 'LOAD_USER_FAILED';
  readonly error: NotLoggedInError | NetworkError;
};

export type Login = {
  readonly type: 'LOG_IN';
  readonly username: string;
  readonly password: string;
};
export type LoginSucceeded = {
  readonly type: 'LOG_IN_SUCCEEDED';
  readonly user: User;
};
export type LoginFailed = {
  readonly type: 'LOG_IN_FAILED';
  readonly error: LoginError | NetworkError;
};

export type Logout = {
  readonly type: 'LOG_OUT';
};
export type LogoutSucceeded = {
  readonly type: 'LOG_OUT_SUCCEEDED';
};
export type LogoutFailed = {
  readonly type: 'LOG_OUT_FAILED';
  readonly error: NetworkError;
};

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

export function loadUserSucceeded(user: User): LoadUserSucceeded {
  return { type: 'LOAD_USER_SUCCEEDED', user };
}

export function loadUserFailed(error: NotLoggedInError | NetworkError): LoadUserFailed {
  return { type: 'LOAD_USER_FAILED', error };
}

export function login(username: string, password: string): Login {
  return { type: 'LOG_IN', username, password };
}

export function loginSucceeded(user: User): LoginSucceeded {
  return { type: 'LOG_IN_SUCCEEDED', user };
}

export function loginFailed(error: LoginError | NetworkError): LoginFailed {
  return { type: 'LOG_IN_FAILED', error };
}

export function logout(): Logout {
  return { type: 'LOG_OUT' };
}

export function logoutSucceeded(): LogoutSucceeded {
  return { type: 'LOG_OUT_SUCCEEDED' };
}

export function logoutFailed(error: NetworkError): LogoutFailed {
  return { type: 'LOG_OUT_FAILED', error };
}
