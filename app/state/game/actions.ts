import { NetworkError } from '../util/types';
import { Game } from './models';

// Actions.
export type StartGame = {
  readonly type: 'START_GAME';
  readonly gameId: string;
};

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

export type GameAction =
  | StartGame
  | LoadGame
  | LoadGameSucceeded
  | LoadGameFailed
  | ConnectGame
  | ConnectGameSucceeded
  | ConnectGameFailed;

export function startGame(gameId: string): StartGame {
  return { type: 'START_GAME', gameId };
}

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
