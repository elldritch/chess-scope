import { NetworkError } from '../util/types';
import { Crowd, Game, Move } from './models';

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
  readonly socketUrl: string;
};

export type ConnectGameSucceeded = {
  readonly type: 'CONNECT_GAME_SUCCEEDED';
};

export type ConnectGameFailed = {
  readonly type: 'CONNECT_GAME_FAILED';
  readonly error: NetworkError;
};

export type GamePing = {
  readonly type: 'GAME_PING';
  readonly v: number;
};

export type UpdateCrowd = {
  readonly type: 'UPDATE_CROWD';
  readonly crowd: Crowd;
};

export type UpdateMove = {
  readonly type: 'UPDATE_MOVE';
  readonly v: number;
  readonly move: Move;
};

export type UpdateVersion = {
  readonly type: 'UPDATE_VERSION';
  readonly v: number;
};

export type SendMove = {
  readonly type: 'SEND_MOVE';
  readonly from: string;
  readonly to: string;
  readonly promotion?: string;
};

export type GameAction =
  | LoadGame
  | LoadGameSucceeded
  | LoadGameFailed
  | ConnectGame
  | ConnectGameSucceeded
  | ConnectGameFailed
  | GamePing
  | UpdateCrowd
  | UpdateMove
  | UpdateVersion
  | SendMove;

export function loadGame(gameId: string): LoadGame {
  return { type: 'LOAD_GAME', gameId };
}

export function loadGameSucceeded(game: Game): LoadGameSucceeded {
  return { type: 'LOAD_GAME_SUCCEEDED', game };
}

export function loadGameFailed(error: NetworkError): LoadGameFailed {
  return { type: 'LOAD_GAME_FAILED', error };
}

export function connectGame(socketUrl: string): ConnectGame {
  return { type: 'CONNECT_GAME', socketUrl };
}

export function connectGameSucceeded(): ConnectGameSucceeded {
  return { type: 'CONNECT_GAME_SUCCEEDED' };
}

export function connectGameFailed(error: NetworkError): ConnectGameFailed {
  return { type: 'CONNECT_GAME_FAILED', error };
}

export function gamePing(v: number): GamePing {
  return { type: 'GAME_PING', v };
}

export function updateCrowd(crowd: Crowd): UpdateCrowd {
  return { type: 'UPDATE_CROWD', crowd };
}

export function updateMove(v: number, move: Move): UpdateMove {
  return { type: 'UPDATE_MOVE', v, move };
}

export function updateVersion(v: number): UpdateVersion {
  return { type: 'UPDATE_VERSION', v };
}

export function sendMove(from: string, to: string, promotion?: string): SendMove {
  return { type: 'SEND_MOVE', from, to, promotion };
}
