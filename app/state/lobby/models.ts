import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import { Async, Paged } from '../util/types';

export type Player = {
  lag?: number;
  name: string;
  online?: boolean;
  provisional: boolean;
  rating: number;
  ratingDiff?: number | null;
  title?: string | null;
};

export type GamePlayer = Player & {
  userId: string;
};

export type Game = {
  clock: {
    initial: number;
    increment: number;
    totalTime: number;
  };
  color: 'black' | 'white';
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
  winner: 'black' | 'white';
};

export type LobbyState = Readonly<{
  socket: WebSocketSubject<LichessMessage> | null;
  challenges: Challenge[];
  games: Async<Paged<Game> | null>;
  players: number | null;
}>;

export type ChallengePlayer = Player & {
  id: string;
};

export type Challenge = {
  challenger: ChallengePlayer;
  color: 'black' | 'white' | 'random';
  destUser: ChallengePlayer;
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
};

export type Challenges = {
  t: 'challenges';
  d: {
    i18n: { [phrase: string]: string };
    in: Challenge[];
    out: Challenge[];
  };
};

export type Pong = {
  t: 'n';
  r: number;
  d: number;
};

export type ReloadForum = {
  t: 'reload_forum';
};

export type ReloadSeeks = {
  t: 'reload_seeks';
};

export type Tournaments = {
  t: 'tournaments';
  d: string;
};

export type Featured = {
  t: 'featured';
  d: {
    color: 'black' | 'white';
    html: string;
    id: string;
  };
};

export type Simuls = {
  t: 'simuls';
  d: string;
};

export type LichessMessage = Challenges | Pong | ReloadSeeks | ReloadForum | Tournaments | Featured | Simuls;
