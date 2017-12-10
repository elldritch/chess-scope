export type Paged<T> = {
  readonly currentPage: number;
  readonly currentPageResults: ReadonlyArray<T>;
  readonly maxPerPage: number;
  readonly nbPages: number;
  readonly nbResults: number;
  readonly nextPage: number | null;
  readonly previousPage: number | null;
};

// TODO: these two types are incomplete.
export type GameSpeed = 'correspondence';

export type GameVariant = 'standard';
