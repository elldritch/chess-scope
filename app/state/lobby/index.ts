import { MiddlewareAPI } from 'redux';

import { Observable, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import { Action, State } from '../';
import { noop } from '../util';
import { fetch } from '../util/rpc';
import { Async, NetworkError, Paged } from '../util/types';

// Models.
export interface GamePlayer {
  name: null;
  provisional: boolean;
  rating: number;
  ratingDiff: number | null;
  userId: string;
}

export interface Game {
  clock: {
    initial: number;
    increment: number;
    totalTime: number;
  };
  color: 'black';
  createdAt: number;
  id: string;
  lastMoveAt: number;
  perf: string;
  players: {
    white: GamePlayer;
    black: GamePlayer;
  };
  rated: boolean;
  speed: string;
  status: string;
  turns: number;
  url: string;
  variant: string;
  winner: 'white' | 'black';
}

export type LobbyState = Readonly<{
  socket: WebSocketSubject<LichessMessage> | null;
  challenges: Challenge[];
  games: Async<Paged<Game> | null>;
  players: number | null;
}>;

export interface Player {
  id: string;
  lag?: number;
  name: string;
  online: boolean;
  provisional: boolean;
  rating: number;
  title: string | null;
}

export interface Challenge {
  challenger: Player;
  color: 'black' | 'white' | 'random';
  destUser: Player;
  direction: 'in' | 'out';
  id: string;
  initialFen: string | null;
  perf: {
    icon: string;
    name: string;
  };
  rated: boolean;
  status: string;
  timeControl: {
    type: string;
  };
  variant: {
    key: string;
    short: string;
    name: string;
  };
}

export interface Challenges {
  t: 'challenges';
  d: {
    i18n: { [phrase: string]: string };
    in: Challenge[];
    out: Challenge[];
  };
}

export interface Pong {
  t: 'n';
  r: number;
  d: number;
}

export interface ReloadForum {
  t: 'reload_forum';
}

export interface ReloadSeeks {
  t: 'reload_seeks';
}

export interface Tournaments {
  t: 'tournaments';
  d: string;
}

export interface Featured {
  t: 'featured';
  d: {
    color: 'black' | 'white';
    html: string;
    id: string;
  };
}

export interface Simuls {
  t: 'simuls';
  d: string;
}

export type LichessMessage = Challenges | Pong | ReloadSeeks | ReloadForum | Tournaments | Featured | Simuls;

// Actions.
export interface UserReady {
  type: 'USER_READY';
}
export interface Ping {
  type: 'PING';
}
export interface UpdateChallenges {
  type: 'UPDATE_CHALLENGES';
  challenges: Challenge[];
}

export interface LoadGames {
  type: 'LOAD_GAMES';
}
export interface LoadGamesSucceeded {
  type: 'LOAD_GAMES_SUCCEEDED';
  games: Paged<Game>;
}
export interface LoadGamesFailed {
  type: 'LOAD_GAMES_FAILED';
  error: NetworkError;
}

export type LobbyAction = UserReady | Ping | UpdateChallenges | LoadGames | LoadGamesSucceeded | LoadGamesFailed;

export function userReady(): UserReady {
  return { type: 'USER_READY' };
}

export function ping(): Ping {
  return { type: 'PING' };
}

export function updateChallenges(challenges: Challenge[]): UpdateChallenges {
  return { type: 'UPDATE_CHALLENGES', challenges };
}

export function loadGames(): LoadGames {
  return { type: 'LOAD_GAMES' };
}

export function loadGamesSucceeded(games: Paged<Game>): LoadGamesSucceeded {
  return { type: 'LOAD_GAMES_SUCCEEDED', games };
}

export function loadGamesFailed(error: NetworkError): LoadGamesFailed {
  return { type: 'LOAD_GAMES_FAILED', error };
}

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
  action$: Observable<LoadGames | UserReady>,
  store: MiddlewareAPI<State>,
): Observable<LoadGamesSucceeded | LoadGamesFailed> {
  return fetch(
    () => `/api/api/user/${store.getState().user.data!.username}/games`,
    () => ({}),
    noop,
    loadGamesSucceeded,
    loadGamesFailed,
    action$,
  );
}

export function ws$(socket: WebSocketSubject<LichessMessage>): Observable<Action> {
  return Observable.merge(
    // Observable.interval(1000).mapTo(ping()),
    socket.flatMap((message) => {
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
    loadGamesEpic(
      action$.filter(
        (action): action is LoadGames | UserReady => action.type === 'LOAD_GAMES' || action.type === 'USER_READY',
      ),
      store,
    ),
    action$
      .filter((action) => action.type === 'USER_READY')
      .flatMap(() =>
        ws$(store.getState().lobby.socket!).takeUntil(action$.filter((action) => action.type === 'LOG_OUT_SUCCEEDED')),
      ),
  );
}
