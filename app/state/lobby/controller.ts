import { MiddlewareAPI } from 'redux';

import { Observable } from 'rxjs';

import { stringify } from 'qs';

import { Action, State } from '../';
import { noop } from '../util';
import { fetch } from '../util/rpc';
import { connect, makeEpic } from '../util/sockets';
import { NetworkError } from '../util/types';

import {
  connectLobbyFailed,
  connectLobbySucceeded,
  LoadGames,
  LoadGamesFailed,
  loadGamesFailed,
  LoadGamesSucceeded,
  loadGamesSucceeded,
  sendPing,
  updateChallenges,
} from './actions';
import { LichessClientMessage, LichessServerMessage, LobbyState } from './models';

// Reducer.
export function lobbyReducer(state: LobbyState | undefined, action: Action): LobbyState {
  if (!state) {
    return {
      challenges: [],
      games: {
        data: null,
        error: null,
        loading: false,
      },
      players: null,
      socket: {
        data: null,
        error: null,
        loading: false,
      },
    };
  }

  switch (action.type) {
    case 'CONNECT_LOBBY':
      const socket = connect<LichessServerMessage, LichessClientMessage>(
        `ws://localhost:8080/lobby/socket/v1?mobile=1&sri=${Math.random()
          .toString(36)
          .substring(2)}&version=0`,
      );
      return { ...state, socket: { data: socket, error: null, loading: true } };

    case 'CONNECT_LOBBY_SUCCEEDED':
      return { ...state, socket: { ...state.socket, loading: false } };

    case 'CONNECT_LOBBY_FAILED':
      return { ...state, socket: { ...state.socket, loading: false, error: action.error } };

    case 'LOG_OUT_SUCCEEDED':
      if (state.socket.data) {
        state.socket.data.close();
      }
      return { ...state, socket: { data: null, error: null, loading: false } };

    case 'SEND_PING':
      state.socket.data!.send({ t: 'p', v: 1 });
      return state;

    case 'UPDATE_CHALLENGES':
      return { ...state, challenges: action.challenges };

    case 'LOAD_GAMES':
      return { ...state, games: { ...state.games, loading: true } };

    case 'LOAD_GAMES_SUCCEEDED':
      return { ...state, games: { data: action.games, loading: false, error: null } };

    case 'LOAD_GAMES_FAILED':
      return { ...state, games: { ...state.games, loading: false, error: action.error } };

    default:
      return state;
  }
}

// Effects.
export function loadGamesEpic(
  action$: Observable<LoadGames>,
  store: MiddlewareAPI<State>,
): Observable<LoadGamesSucceeded | LoadGamesFailed> {
  return fetch(
    () => `/api/api/user/${store.getState().user.data!.username}/games?${stringify({ playing: 1 })}`,
    () => ({}),
    noop,
    loadGamesSucceeded,
    loadGamesFailed,
    action$,
  );
}

export function lobbyEpic(action$: Observable<Action>, store: MiddlewareAPI<State>): Observable<Action> {
  const socketEpics = makeEpic<LichessServerMessage, LichessClientMessage, Action, NetworkError>({
    action$,
    getSocket: () => store.getState().lobby.socket.data!,
    dispatchMessage: message => {
      switch (message.t) {
        case 'challenges':
          return Observable.of(updateChallenges(message.d.in));
        case 'n':
        case 'reload_seeks':
        case 'reload_forum':
        case 'tournaments':
        case 'featured':
        case 'simuls':
          return Observable.empty<Action>();
        default:
          // tslint:disable-next-line:no-console
          console.log(message);
          return Observable.empty<Action>();
      }
    },
    startSelector: action => action.type === 'CONNECT_LOBBY',
    stopSelector: action => action.type === 'LOG_OUT_SUCCEEDED',
    success: connectLobbySucceeded,
    failure: connectLobbyFailed,
  });

  const pingEpic = Observable.interval(1000)
    .mapTo(sendPing())
    .skipUntil(action$.filter(action => action.type === 'CONNECT_LOBBY_SUCCEEDED'));

  const apiEpics = loadGamesEpic(action$.filter((action): action is LoadGames => action.type === 'LOAD_GAMES'), store);

  return Observable.merge(socketEpics, pingEpic, apiEpics);
}
