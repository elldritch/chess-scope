import { combineEpics } from 'redux-observable';

import { Observable } from 'rxjs';

import { GameAction, gameEpic, gameReducer, GameState } from './game';
import { connectLobby, loadGames, LobbyAction, lobbyEpic, lobbyReducer, LobbyState } from './lobby';
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

export const epic = combineEpics(rootEpic, userEpic, lobbyEpic, gameEpic);

export function rootEpic(action$: Observable<Action>): Observable<Action> {
  // After successfully logging in, load games and connect to lobby websocket.
  return action$
    .filter(action => action.type === 'LOG_IN_SUCCEEDED' || action.type === 'LOAD_USER_SUCCEEDED')
    .flatMapTo(Observable.from([connectLobby(), loadGames()]));
}
