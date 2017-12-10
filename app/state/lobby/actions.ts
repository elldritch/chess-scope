import { Paged } from '../../state/util/models';
import { NetworkError } from '../util/types';

import { Challenge, Game } from './models';

export type UserReady = {
  readonly type: 'USER_READY';
};
export type Ping = {
  readonly type: 'PING';
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

export type LobbyAction = UserReady | Ping | UpdateChallenges | LoadGames | LoadGamesSucceeded | LoadGamesFailed;

export function userReady(): UserReady {
  return { type: 'USER_READY' };
}

export function ping(): Ping {
  return { type: 'PING' };
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
