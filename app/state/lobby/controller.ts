import { MiddlewareAPI } from 'redux';

import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import { stringify } from 'qs';

import { Action, State } from '../';
import { noop } from '../util';
import { fetch } from '../util/rpc';

import {
  LoadGames,
  loadGames,
  LoadGamesFailed,
  loadGamesFailed,
  LoadGamesSucceeded,
  loadGamesSucceeded,
  ping,
  updateChallenges,
} from './actions';
import { LichessMessage, LobbyState } from './models';

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
      socket: null,
    };
  }

  switch (action.type) {
    case 'USER_READY':
      const socket = Observable.webSocket<LichessMessage>(
        `ws://localhost:8080/lobby/socket/v1?mobile=1&sri=${Math.random()
          .toString(36)
          .substring(2)}&version=0`,
      );
      return { ...state, socket };

    case 'LOG_OUT_SUCCEEDED':
      state.socket!.socket.close();
      return { ...state, socket: null };

    case 'PING':
      state.socket!.socket.send(JSON.stringify({ t: 'p', v: 1 }));
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

export function ws$(socket: WebSocketSubject<LichessMessage>): Observable<Action> {
  return Observable.merge(
    Observable.interval(1000).mapTo(ping()),
    socket.flatMap(message => {
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
    }),
  );
}

export function lobbyEpic(action$: Observable<Action>, store: MiddlewareAPI<State>): Observable<Action> {
  return Observable.merge(
    action$.filter(action => action.type === 'USER_READY').mapTo(loadGames()),
    loadGamesEpic(action$.filter((action): action is LoadGames => action.type === 'LOAD_GAMES'), store),
    action$
      .filter(action => action.type === 'USER_READY')
      .flatMap(() =>
        ws$(store.getState().lobby.socket!).takeUntil(action$.filter(action => action.type === 'LOG_OUT_SUCCEEDED')),
      ),
  );
}
