import { WrappedSocket } from '../util/sockets';
import { Async } from '../util/types';

// API response models.
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
    readonly color: 'black' | 'white';
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

// WebSocket response models.
export type Crowd = {
  readonly t: 'crowd';
  readonly d: {
    readonly white: boolean;
    readonly black: boolean;
    readonly watchers: number;
  };
};

export type Pong = {
  readonly t: 'n';
};

export type Move = {
  readonly t: 'move';
  readonly v: number;
  readonly d: {
    readonly dests: {
      readonly [from: string]: string;
    };
    readonly fen: string;
    readonly ply: number;
    readonly san: string;
    readonly uci: string;
  };
};

export type Batch = {
  readonly t: 'b';
  readonly d: ReadonlyArray<Move>;
};

export type Ack = {
  readonly t: 'ack';
};

export type GameServerMessage = Crowd | Pong | Move | Batch | Ack;

// WebSocket request models.
export type Ping = {
  readonly t: 'p';
  readonly v: number;
};

export type MakeMove = {
  readonly t: 'move';
  readonly d: {
    readonly from: string;
    readonly to: string;
    readonly promotion?: string;
  };
};

export type GameClientMessage = Ping | MakeMove;

export type GameState = {
  readonly crowd: Crowd | null;
  readonly moves: {
    readonly [version: number]: Move;
  };
  readonly game: Async<Game | null>;

  readonly board: string;
  readonly v: number;
  readonly socket: Async<WrappedSocket<GameServerMessage, GameClientMessage> | null>;
};
