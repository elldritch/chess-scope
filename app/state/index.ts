import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import { LobbyAction, lobbyEpic, lobbyReducer, LobbyState } from './lobby';
import { UserAction, userEpic, userReducer, UserState } from './user';

export interface State {
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
}

export type Action = UserAction | LobbyAction;

export const reducers = { user: userReducer, lobby: lobbyReducer };

export const epic = combineEpics(userEpic, lobbyEpic);
