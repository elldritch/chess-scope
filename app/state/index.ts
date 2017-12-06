import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { UserAction, userEpic, userReducer, UserState } from './user';
import { LobbyAction, lobbyEpic, lobbyReducer, LobbyState } from './lobby';

export type State = {
  lobby: LobbyState;
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

export type Action = UserAction | LobbyAction;

export const reducers = { user: userReducer, lobby: lobbyReducer };

export const epic = combineEpics(userEpic, lobbyEpic);
