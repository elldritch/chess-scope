import { Observable } from 'rxjs';

import { Action } from '../';

// Models.
export type Game = {
  id: string;
  variant: string;
  speed: string;
  perf: string;
  rated: boolean;
  opponent: {
    id: string;
    username: string;
    rating: number;
  };
};

export type LobbyState = Readonly<{
  socket: WebSocket | null;
  challenges: Game[];
  games: Game[];
}>;

// Actions.
export type UserReady = { type: 'USER_READY' };

export type LobbyAction = UserReady;

export function userReady(): UserReady {
  return { type: 'USER_READY' };
}

// Reducer.
export function lobbyReducer(state: LobbyState | undefined, action: Action): LobbyState {
  if (!state) {
    return { socket: null, challenges: [], games: [] };
  }

  switch (action.type) {
    case 'USER_READY':
      const socket = new WebSocket(`ws://localhost:8080/lobby/socket/v1?mobile=1&sri=${Math.random().toString(36).substring(2)}&version=0`);
      return { ...state, socket };
    
    case 'LOG_OUT_SUCCEEDED':
      state.socket!.close();
      return { ...state, socket: null };

    default:
      return state;
  }
}

// Effects.
export function lobbyEpic(action$: Observable<Action>): Observable<Action> {
  return Observable.empty();
}
