import { WrappedSocket } from '../util/sockets';
import { Async } from '../util/types';

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

export type GameServerMessage = {};

export type GameClientMessage = {};

export type GameState = {
  readonly game: Async<Game | null>;
  readonly socket: Async<WrappedSocket<GameServerMessage, GameClientMessage> | null>;
};
