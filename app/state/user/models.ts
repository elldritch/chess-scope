import { Async, Error, NetworkError } from '../util/types';

// Models.
interface GameRating {
  games: number;
  prog: number;
  prov: boolean;
  rating: number;
  rd: number;
}

export interface NowPlayingGame {
  color: 'white' | 'black';
  fen: string;
  fullId: string;
  gameId: string;
  isMyTurn: boolean;
  lastMove: string;
  opponent: {
    id: string;
    username: string;
    rating: number;
  };
  perf: string;
  rated: boolean;
  secondsLeft: number | null;
  speed: string;
  variant: {
    key: string;
    name: string;
  };
}

export interface User {
  createdAt: number;
  id: string;
  language?: string;
  profile?: Partial<{
    bio: string;
    country: string;
    firstName: string;
    lastName: string;
    location: string;
  }>;
  nowPlaying: NowPlayingGame[];
  online: boolean;
  perfs: {
    blitz: GameRating;
    bullet: GameRating;
    classical: GameRating;
    correspondence: GameRating;
    rapid: GameRating;
  };
  playTime: {
    total: 0;
    tv: 0;
  };
  seenAt: number;
  username: string;
}

export type UserState = Readonly<Async<User | null, LoginError | NotLoggedInError | NetworkError>>;

// Errors.
export type NotLoggedInError = Error<'AUTHENTICATION_REQUIRED', 'Must be logged in to do this.'>;

export function notLoggedInError(details: {}): NotLoggedInError {
  return { error: 'AUTHENTICATION_REQUIRED', reason: 'Must be logged in to do this.', details };
}

export type LoginError = Error<'AUTHENTICATION_FAILED', 'Incorrect username or password.'>;

export function loginError(details: {}): LoginError {
  return { error: 'AUTHENTICATION_FAILED', reason: 'Incorrect username or password.', details };
}
