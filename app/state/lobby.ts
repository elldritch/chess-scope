import { Game } from './models';

// Models.
type LobbyState = {
  socket: WebSocket;
  challenges: Game[];
  games: Game[];
};

// Actions.
type UserReady = { type: 'USER_READY' };

// Reducer.

// Effects.
