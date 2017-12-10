import { Action } from 'redux';
import { Observable } from 'rxjs';

import * as qs from 'qs';

import { Error, networkError, notFoundError, serverError } from './types';

export type fetchConfig<A extends Action, S extends Action, F extends Action> = {
  readonly url: string | ((action: A) => string);
  readonly request?: (action: A) => Partial<RequestInit>;
  readonly handleErr?: (res: Response) => void;
  readonly success: (data: any) => S;
  readonly failure: (err: Error<any, any>) => F;
  readonly action$: Observable<A>;
};

export function fetch<A extends Action, S extends Action, F extends Action>(
  config: fetchConfig<A, S, F>,
): Observable<S | F> {
  const { url, request, handleErr, success, failure, action$ } = config;

  return action$.switchMap(action => {
    const options = request ? request(action) : {};

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

    const endpoint = typeof url === 'string' ? url : url(action);

    return Observable.from(
      window
        .fetch(endpoint, options)
        .catch(err => {
          throw networkError(err);
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          }

          if (handleErr) {
            handleErr(res);
          }

          if (res.status === 404) {
            throw notFoundError(res);
          }
          if (res.status === 500) {
            throw serverError(res);
          }
          throw networkError(res);
        }),
    )
      .map(success)
      .catch(err => Observable.of(failure(err)));
  });
}
