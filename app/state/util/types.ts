export type Async<T, E = Error<string>> = {
  readonly loading: boolean;
  readonly error: E | null;
  readonly data: T;
};

export type Error<Code, Reason = string, Details = {}> = {
  readonly error: Code;
  readonly reason: Reason;
  readonly details: Details;
};

export type NetworkError = Error<'NETWORK_ERROR', 'Something went wrong with your connection.'>;

export function networkError(details: {}): NetworkError {
  return { error: 'NETWORK_ERROR', reason: 'Something went wrong with your connection.', details };
}

export type NotFoundError = Error<'NOT_FOUND_ERROR', 'Resource could not be found.'>;

export function notFoundError(details: {}): NotFoundError {
  return { error: 'NOT_FOUND_ERROR', reason: 'Resource could not be found.', details };
}

export type ServerError = Error<'SERVER_ERROR', 'Something went wrong on the server.'>;

export function serverError(details: {}): ServerError {
  return { error: 'SERVER_ERROR', reason: 'Something went wrong on the server.', details };
}
