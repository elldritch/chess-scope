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
