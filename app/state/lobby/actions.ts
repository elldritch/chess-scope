import { NetworkError, Paged } from '../util/types';

import { Challenge, Game } from './models';

export type UserReady = {
  type: 'USER_READY';
};
export type Ping = {
  type: 'PING';
};
export type UpdateChallenges = {
  type: 'UPDATE_CHALLENGES';
  challenges: Challenge[];
};

export type LoadGames = {
  type: 'LOAD_GAMES';
};
export type LoadGamesSucceeded = {
  type: 'LOAD_GAMES_SUCCEEDED';
  games: Paged<Game>;
};
export type LoadGamesFailed = {
  type: 'LOAD_GAMES_FAILED';
  error: NetworkError;
};

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
