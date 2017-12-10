import { Async, Error, NetworkError } from '../util/types';

// Models.
type GameRating = {
  readonly games: number;
  readonly prog: number;
  readonly prov: boolean;
  readonly rating: number;
  readonly rd: number;
};

export type NowPlayingGame = {
  readonly color: 'black' | 'white';
  readonly fen: string;
  readonly fullId: string;
  readonly gameId: string;
  readonly isMyTurn: boolean;
  readonly lastMove: string;
  readonly opponent: {
    readonly id: string;
    readonly username: string;
    readonly rating: number;
  };
  readonly perf: string;
  readonly rated: boolean;
  readonly secondsLeft: number | null;
  readonly speed: string;
  readonly variant: {
    readonly key: string;
    readonly name: string;
  };
};

export type User = {
  readonly createdAt: number;
  readonly id: string;
  readonly language?: string;
  readonly profile?: Partial<{
    readonly bio: string;
    readonly country: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly location: string;
  }>;
  readonly nowPlaying: ReadonlyArray<NowPlayingGame>;
  readonly online: boolean;
  readonly perfs: {
    readonly blitz: GameRating;
    readonly bullet: GameRating;
    readonly classical: GameRating;
    readonly correspondence: GameRating;
    readonly rapid: GameRating;
  };
  readonly playTime: {
    readonly total: 0;
    readonly tv: 0;
  };
  readonly seenAt: number;
  readonly username: string;
};

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
