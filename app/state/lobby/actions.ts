import { Paged } from '../../state/util/models';
import { NetworkError } from '../util/types';

import { Challenge, Game } from './models';

export type ConnectLobby = {
  readonly type: 'CONNECT_LOBBY';
};

export type ConnectLobbySucceeded = {
  readonly type: 'CONNECT_LOBBY_SUCCEEDED';
};

export type ConnectLobbyFailed = {
  readonly type: 'CONNECT_LOBBY_FAILED';
  readonly error: NetworkError;
};

export type SendPing = {
  readonly type: 'SEND_PING';
};

export type UpdateChallenges = {
  readonly type: 'UPDATE_CHALLENGES';
  readonly challenges: ReadonlyArray<Challenge>;
};

export type LoadGames = {
  readonly type: 'LOAD_GAMES';
};

export type LoadGamesSucceeded = {
  readonly type: 'LOAD_GAMES_SUCCEEDED';
  readonly games: Paged<Game>;
};

export type LoadGamesFailed = {
  readonly type: 'LOAD_GAMES_FAILED';
  readonly error: NetworkError;
};

export type LobbyAction =
  | ConnectLobby
  | ConnectLobbySucceeded
  | ConnectLobbyFailed
  | SendPing
  | UpdateChallenges
  | LoadGames
  | LoadGamesSucceeded
  | LoadGamesFailed;

export function connectLobby(): ConnectLobby {
  return { type: 'CONNECT_LOBBY' };
}

export function connectLobbySucceeded(): ConnectLobbySucceeded {
  return { type: 'CONNECT_LOBBY_SUCCEEDED' };
}

export function connectLobbyFailed(error: NetworkError): ConnectLobbyFailed {
  return { type: 'CONNECT_LOBBY_FAILED', error };
}

export function sendPing(): SendPing {
  return { type: 'SEND_PING' };
}

export function updateChallenges(challenges: ReadonlyArray<Challenge>): UpdateChallenges {
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
