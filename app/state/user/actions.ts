import { NetworkError } from '../util/types';
import { LoginError, NotLoggedInError, User } from './models';

export type LoadUser = {
  type: 'LOAD_USER';
};
export type LoadUserSucceeded = {
  type: 'LOAD_USER_SUCCEEDED';
  user: User;
};
export type LoadUserFailed = {
  type: 'LOAD_USER_FAILED';
  error: NotLoggedInError | NetworkError;
};

export type Login = {
  type: 'LOG_IN';
  username: string;
  password: string;
};
export type LoginSucceeded = {
  type: 'LOG_IN_SUCCEEDED';
  user: User;
};
export type LoginFailed = {
  type: 'LOG_IN_FAILED';
  error: LoginError | NetworkError;
};

export type Logout = {
  type: 'LOG_OUT';
};
export type LogoutSucceeded = {
  type: 'LOG_OUT_SUCCEEDED';
};
export type LogoutFailed = {
  type: 'LOG_OUT_FAILED';
  error: NetworkError;
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
