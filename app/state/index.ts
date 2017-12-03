import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { userReducer, userEpic, UserAction, UserState } from './user';

export type State = {
  user: UserState;
  router: {
    location: {
      pathname: string;
      search: string;
      hash: string;
      key: string;
    };
  };
};

export type Action = UserAction;

export const reducers = { user: userReducer };

export const epic = combineEpics(userEpic);
