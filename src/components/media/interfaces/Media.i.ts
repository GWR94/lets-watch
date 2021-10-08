export interface MediaProps {
  type: "tv" | "movie";
}

export interface MediaState {
  results: TmdbMovieResult[] | TmdbTVResult[];
  error: string;
  page: number;
  query: string;
  maxPages: number;
  discover: boolean;
  queryURL: string | null;
}

export interface TmdbAPIResult {
  poster_path: string;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface TmdbTVResult extends TmdbAPIResult {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_name: string;
  overview: string;
}

export interface TmdbMovieResult extends TmdbAPIResult {
  adult: boolean;
  original_title: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: 7.9;
  vote_count: 2285;
}
