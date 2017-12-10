import { combineEpics } from 'redux-observable';

import { GameAction, gameEpic, gameReducer, GameState } from './game';
import { LobbyAction, lobbyEpic, lobbyReducer, LobbyState } from './lobby';
import { UserAction, userEpic, userReducer, UserState } from './user';

export type State = {
  readonly lobby: LobbyState;
  readonly user: UserState;
  readonly game: GameState;
  readonly router: {
    readonly location: {
      readonly pathname: string;
      readonly search: string;
      readonly hash: string;
      readonly key: string;
    };
  };
};

export type Action = UserAction | LobbyAction | GameAction;

export const reducers = { user: userReducer, lobby: lobbyReducer, game: gameReducer };

export const epic = combineEpics(userEpic, lobbyEpic, gameEpic);
