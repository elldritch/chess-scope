import { Action } from 'redux';

import { Observable, Subject } from 'rxjs';

import { Error } from './types';

export type StatusMessage =
  | {
      readonly status: 'OPEN';
      readonly event: Event;
    }
  | {
      readonly status: 'CLOSED';
      readonly event: CloseEvent;
    };

export type SendError =
  | Error<'SOCKET_STILL_CONNECTING', 'Socket is not yet open.'>
  | Error<'SOCKET_CLOSING', 'Socket is in the process of closing.'>;

export type WrappedSocket<InMessage, OutMessage> = {
  readonly raw: WebSocket;
  readonly status: Observable<StatusMessage>;
  readonly messages: Observable<InMessage>;
  readonly send: (message: OutMessage) => SendError | void;
  readonly close: (code?: number, reason?: string) => void;
};

export function connect<InMessage, OutMessage>(url: string): WrappedSocket<InMessage, OutMessage> {
  const socket = new WebSocket(url);

  const statusSubject = new Subject<StatusMessage>();
  const messageSubject = new Subject<InMessage>();

  socket.onopen = event => {
    statusSubject.next({ status: 'OPEN', event });
  };
  socket.onclose = event => {
    statusSubject.next({ status: 'CLOSED', event });
    statusSubject.complete();
    messageSubject.complete();
  };
  socket.onmessage = message => {
    try {
      messageSubject.next(JSON.parse(message.data));
    } catch (error) {
      messageSubject.error(error);
    }
  };
  socket.onerror = event => {
    messageSubject.error(event);
  };

  return {
    raw: socket,
    status: statusSubject.asObservable(),
    messages: messageSubject.asObservable(),
    send: message =>
      socket.readyState === WebSocket.CONNECTING
        ? { error: 'SOCKET_STILL_CONNECTING', reason: 'Socket is not yet open.', details: {} }
        : socket.readyState === WebSocket.CLOSING
          ? { error: 'SOCKET_CLOSING', reason: 'Socket is in the process of closing.', details: {} }
          : socket.send(JSON.stringify(message)),
    close: (code?, reason?) => socket.close(code, reason),
  };
}

export type makeEpicConfig<I, O, A extends Action, E> = {
  readonly action$: Observable<Action>;
  readonly getSocket: () => WrappedSocket<I, O>;
  readonly dispatchMessage: (message: I) => Observable<A>;
  readonly startSelector: (action: Action) => boolean;
  readonly stopSelector: (action: Action) => boolean;
  readonly success: () => A;
  readonly failure: (error: E) => A;
};

export function makeEpic<I, O, A extends Action, E>(options: makeEpicConfig<I, O, A, E>): Observable<A> {
  const { action$, getSocket, dispatchMessage, startSelector, success, failure, stopSelector } = options;

  const start$ = action$.filter(startSelector);
  const stop$ = action$.filter(stopSelector);

  return start$
    .flatMap(() => {
      const socket = getSocket();
      const open$ = socket.status.filter(message => message.status === 'OPEN');
      const close$ = socket.status.filter(message => message.status === 'CLOSED');

      return Observable.merge(
        open$.mapTo(success()),
        socket.messages
          .flatMap(dispatchMessage)
          .skipUntil(open$)
          .takeUntil(Observable.merge(stop$, close$)),
      );
    })
    .catch(error => Observable.of(failure(error)));
}
