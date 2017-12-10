import { Observable } from 'rxjs';

import { Action } from '../';

import { fetch } from '../util/rpc';
import { Async, NetworkError } from '../util/types';

// Models.
export type Game = {
  readonly game: {
    readonly id: string;
    readonly variant: {
      readonly key: string;
      readonly name: string;
      readonly short: string;
    };
    readonly speed: string;
    readonly perf: string;
    readonly rated: boolean;
    readonly initialFen: string;
    readonly fen: string;
    readonly player: string;
    readonly turns: number;
    readonly startedAtTurn: number;
    readonly source: string;
    readonly status: {
      readonly id: number;
      readonly name: string;
    };
    readonly createdAt: number;
    readonly lastMove: string;
  };
  readonly player: {
    readonly color: string;
    readonly user: {
      readonly id: string;
      readonly username: string;
      readonly online: boolean;
      readonly perfs: {
        readonly correspondence: {
          readonly games: number;
          readonly rating: number;
          readonly rd: number;
          readonly prog: number;
          readonly prov: boolean;
        };
      };
      readonly language: string;
    };
    readonly rating: number;
    readonly provisional: boolean;
    readonly id: string;
    readonly version: number;
  };
  readonly opponent: {
    readonly color: string;
    readonly user: {
      readonly id: string;
      readonly username: string;
      readonly online: boolean;
      readonly perfs: {
        readonly correspondence: {
          readonly games: number;
          readonly rating: number;
          readonly rd: number;
          readonly prog: number;
          readonly prov: boolean;
        };
      };
      readonly language: string;
    };
    readonly rating: number;
    readonly provisional: boolean;
    readonly ai: boolean | null;
  };
  readonly url: {
    readonly socket: string;
    readonly round: string;
  };
  readonly pref: {
    readonly animationDuration: number;
    readonly coords: 2;
    readonly replay: 2;
    readonly autoQueen: 3;
    readonly clockTenths: 1;
    readonly moveEvent: 2;
    readonly clockBar: boolean;
    readonly clockSound: boolean;
    readonly confirmResign: boolean;
    readonly rookCastle: boolean;
    readonly highlight: boolean;
    readonly destination: boolean;
    readonly enablePremove: boolean;
    readonly showCaptured: boolean;
  };
  readonly takebackable: boolean;
  readonly possibleMoves: {
    readonly [position: string]: string;
  };
  readonly steps: [
    {
      readonly ply: number;
      readonly uci: string | null;
      readonly san: string | null;
      readonly fen: string;
    }
  ];
  readonly chat: ReadonlyArray<any>;
};

export type GameState = {
  readonly game: Async<Game | null>;
  readonly socket: Async<null>;
};

// Actions.
export type LoadGame = {
  readonly type: 'LOAD_GAME';
  readonly gameId: string;
};

export type LoadGameSucceeded = {
  readonly type: 'LOAD_GAME_SUCCEEDED';
  readonly game: Game;
};

export type LoadGameFailed = {
  readonly type: 'LOAD_GAME_FAILED';
  readonly error: NetworkError;
};

export type ConnectGame = {
  readonly type: 'CONNECT_GAME';
  readonly gameId: string;
};

export type GameAction = LoadGame | LoadGameSucceeded | LoadGameFailed;

export function loadGame(gameId: string): LoadGame {
  return { type: 'LOAD_GAME', gameId };
}

export function loadGameSucceeded(game: Game): LoadGameSucceeded {
  return { type: 'LOAD_GAME_SUCCEEDED', game };
}

export function loadGameFailed(error: NetworkError): LoadGameFailed {
  return { type: 'LOAD_GAME_FAILED', error };
}

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

export function gameEpic(action$: Observable<Action>): Observable<Action> {
  return loadGameEpic(action$.filter((action): action is LoadGame => action.type === 'LOAD_GAME'));
}
