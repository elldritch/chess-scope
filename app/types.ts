export type Async<T, E = Error<string>> = {
  loading: boolean;
  error: E | null;
  data: T;
};

export type Error<Code, Reason = string, Details = {}> = {
  error: Code;
  reason: Reason;
  details: Details;
};

export type NetworkError = Error<'NETWORK_ERROR', 'Something went wrong with your connection.'>;
export function networkError(details: {}): NetworkError {
  return { error: 'NETWORK_ERROR', reason: 'Something went wrong with your connection.', details };
}

export type NotFoundError = Error<'NOT_FOUND_ERROR', 'Resource could not be found.'>;

export type ServerError = Error<'SERVER_ERROR', 'Something went wrong on the server.'>;
