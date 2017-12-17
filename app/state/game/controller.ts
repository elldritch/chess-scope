import { MiddlewareAPI } from 'redux';
import { Observable } from 'rxjs';

import { Action, State } from '../';

import { fetch } from '../util/rpc';
import { connect, makeEpic } from '../util/sockets';
import { exhaustive, NetworkError } from '../util/types';

import {
  connectGame,
  connectGameFailed,
  connectGameSucceeded,
  GameAction,
  gamePing,
  LoadGame,
  loadGameFailed,
  LoadGameFailed,
  LoadGameSucceeded,
  loadGameSucceeded,
  updateCrowd,
  updateMove,
  updateVersion,
} from './actions';
import { GameClientMessage, GameServerMessage, GameState } from './models';

// Reducers.
export function gameReducer(state: GameState | undefined, action: GameAction): GameState {
  if (!state) {
    return {
      crowd: null,
      moves: {},
      board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      v: 0,
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

    case 'GAME_PING':
      state.socket.data!.send({ t: 'p', v: action.v });
      return state;

    case 'UPDATE_VERSION':
      return { ...state, v: action.v };

    case 'UPDATE_CROWD':
      return { ...state, crowd: action.crowd };

    case 'UPDATE_MOVE':
      return { ...state, moves: { ...state.moves, [action.v]: action.move }, board: action.move.d.fen };

    case 'SEND_MOVE':
      state.socket.data!.send({ t: 'move', d: { from: action.from, to: action.to, promotion: action.promotion } });
      return state;

    default:
      return exhaustive(action, state);
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
      switch (message.t) {
        case 'crowd':
          return Observable.of(updateCrowd(message));
        case 'move':
          return Observable.from([updateMove(message.v, message), updateVersion(message.v)]);
        case 'b':
          return Observable.from(
            message.d
              .map<GameAction>(move => updateMove(move.v, move))
              .concat([updateVersion(message.d.map(msg => msg.v).reduce((a, b) => Math.max(a, b), 0))]),
          );
        case 'n':
        case 'ack':
          return Observable.empty<Action>();
        default:
          // tslint:disable-next-line:no-console
          console.log(message);
          return exhaustive(message, Observable.empty<Action>());
      }
    },
    startSelector: action => action.type === 'CONNECT_GAME',
    stopSelector: action => action.type === 'LOG_OUT_SUCCEEDED',
    success: connectGameSucceeded,
    failure: connectGameFailed,
  });

  const pingEpic = Observable.interval(1000)
    .map(() => gamePing(store.getState().game.v))
    .skipUntil(action$.filter(action => action.type === 'CONNECT_GAME_SUCCEEDED'))
    .takeUntil(action$.filter(action => action.type === 'CONNECT_GAME_FAILED'));

  return Observable.merge(
    action$
      .filter<Action, LoadGameSucceeded>((action): action is LoadGameSucceeded => action.type === 'LOAD_GAME_SUCCEEDED')
      .map((action: LoadGameSucceeded) => connectGame(action.game.url.socket)),
    socketEpic,
    pingEpic,
    loadGameEpic(action$.filter((action): action is LoadGame => action.type === 'LOAD_GAME')),
  );
}
