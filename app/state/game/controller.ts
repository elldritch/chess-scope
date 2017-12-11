import { MiddlewareAPI } from 'redux';
import { Observable } from 'rxjs';

import { Action, State } from '../';

import { fetch } from '../util/rpc';
import { connect, makeEpic } from '../util/sockets';
import { NetworkError } from '../util/types';

import {
  connectGame,
  connectGameFailed,
  connectGameSucceeded,
  LoadGame,
  loadGameFailed,
  LoadGameFailed,
  LoadGameSucceeded,
  loadGameSucceeded,
} from './actions';
import { GameClientMessage, GameServerMessage, GameState } from './models';

// Reducers.
export function gameReducer(state: GameState | undefined, action: Action): GameState {
  if (!state) {
    return {
      game: {
        loading: false,
        data: null,
        error: null,
      },
      socket: {
        loading: false,
        data: null,
        error: null,
      },
    };
  }

  switch (action.type) {
    case 'LOAD_GAME':
      return { ...state, game: { ...state.game, loading: true } };

    case 'LOAD_GAME_SUCCEEDED':
      return { ...state, game: { data: action.game, loading: false, error: null } };

    case 'LOAD_GAME_FAILED':
      return { ...state, game: { ...state.game, loading: false, error: action.error } };

    case 'CONNECT_GAME':
      const socket = connect<GameServerMessage, GameClientMessage>(
        `ws://localhost:8080${action.socketUrl}?mobile=1&sri=${Math.random()
          .toString(36)
          .substring(2)}&version=0`,
      );
      return { ...state, socket: { data: socket, error: null, loading: true } };

    case 'CONNECT_GAME_SUCCEEDED':
      return { ...state, socket: { ...state.socket, loading: false } };

    case 'CONNECT_GAME_FAILED':
      return { ...state, socket: { ...state.socket, loading: false, error: action.error } };

    default:
      return state;
  }
}

// Effects.
export function loadGameEpic(action$: Observable<LoadGame>): Observable<LoadGameSucceeded | LoadGameFailed> {
  return fetch({
    url: action => `/api/${action.gameId}`,
    success: loadGameSucceeded,
    failure: loadGameFailed,
    action$,
  });
}

export function gameEpic(action$: Observable<Action>, store: MiddlewareAPI<State>): Observable<Action> {
  const socketEpic = makeEpic<GameServerMessage, GameClientMessage, Action, NetworkError>({
    action$,
    getSocket: () => store.getState().game.socket.data!,
    dispatchMessage: message => {
      console.log(message);
      return Observable.empty<Action>();
    },
    startSelector: action => action.type === 'CONNECT_GAME',
    stopSelector: action => action.type === 'LOG_OUT_SUCCEEDED',
    success: connectGameSucceeded,
    failure: connectGameFailed,
  });

  return Observable.merge(
    action$
      .filter<Action, LoadGameSucceeded>((action): action is LoadGameSucceeded => action.type === 'LOAD_GAME_SUCCEEDED')
      .map((action: LoadGameSucceeded) => connectGame(action.game.url.socket)),
    socketEpic,
    loadGameEpic(action$.filter((action): action is LoadGame => action.type === 'LOAD_GAME')),
  );
}
