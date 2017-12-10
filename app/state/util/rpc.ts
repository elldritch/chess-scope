import { Action } from 'redux';
import { Observable } from 'rxjs';

import * as qs from 'qs';

import { Error, networkError, notFoundError, serverError } from './types';

export function fetch<A extends Action, S extends Action, F extends Action>(
  makeUrl: (action: A) => string,
  makeOptions: (action: A) => Partial<RequestInit>,
  handleErr: (res: Response) => void,
  successAction: (data: any) => S,
  failAction: (err: Error<any, any>) => F,
  action$: Observable<A>,
): Observable<S | F> {
  return action$.switchMap(action => {
    const options = makeOptions(action);

    // Don't forget to send cookies.
    if (options.credentials === undefined) {
      options.credentials = 'same-origin';
    }
    // Don't forget to stringify form bodies.
    if (typeof options.body === 'object') {
      options.body = qs.stringify(options.body);
    }
    // Set headers -- handle all possible header types (Headers object, string[][], undefined).
    if (options.headers instanceof Headers) {
      // Set form content-type.
      if (options.body && !options.headers.has('Content-Type')) {
        options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
      // Set lichess headers.
      if (!options.headers.has('Accept')) {
        options.headers.set('Accept', 'application/vnd.lichess.v1+json');
      }
    } else if (Array.isArray(options.headers)) {
      // Set form content-type.
      if (options.body && options.headers.filter(header => header[0] === 'Content-Type').length === 0) {
        options.headers.push(['Content-Type', 'application/x-www-form-urlencoded']);
      }
      // Set lichess headers.
      if (options.headers.filter(header => header[0] === 'Accept').length === 0) {
        options.headers.push(['Accept', 'application/vnd.lichess.v1+json']);
      }
    } else {
      const headers = new Headers();
      if (options.body) {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
      headers.set('Accept', 'application/vnd.lichess.v1+json');
      options.headers = headers;
    }

    return Observable.from(
      window
        .fetch(makeUrl(action), options)
        .catch(err => {
          throw networkError(err);
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          }

          handleErr(res);

          if (res.status === 404) {
            throw notFoundError(res);
          }
          if (res.status === 500) {
            throw serverError(res);
          }
          throw networkError(res);
        }),
    )
      .map(successAction)
      .catch(err => Observable.of(failAction(err)));
  });
}
