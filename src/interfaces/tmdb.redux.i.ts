import { TmdbMovieResult, TmdbTVResult } from "../components/media/interfaces/Media.i";

export const FETCH_TOP_MOVIES = "fetch_top_movies";
export const FETCH_TOP_TV = "fetch_top_tv";
export const FETCH_CURRENT_MOVIE = "fetch_current_movie";
export const FETCH_CURRENT_TV = "fetch_current_tv";

export interface FetchTopMoviesAction {
  type: typeof FETCH_TOP_MOVIES;
  payload: {
    results: TmdbMovieResult[];
  };
}

export interface FetchTopTVAction {
  type: typeof FETCH_TOP_TV;
  payload: {
    results: TmdbTVResult[];
  };
}

export interface FetchCurrentMovieAction {
  type: typeof FETCH_CURRENT_MOVIE;
  payload: FetchCurrentMovieResponse;
}

export interface FetchCurrentTVAction {
  type: typeof FETCH_CURRENT_TV;
  payload: FetchCurrentTVResponse;
}

export interface FetchCurrentMovieResponse {
  id: number;
  title: string;
  tagline: string;
  genres: [
    {
      id: number;
      name: string;
    },
  ];
  overview: string;
  vote_average: number;
  language: string;
  homepage: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
}

export interface FetchCurrentTVResponse {
  id: number;
  name: string;
  backdrop_path: string;
  first_air_date: string;
  language: string;
  genres: [
    {
      id: number;
      name: string;
    },
  ];
  homepage: string;
  next_episode_to_air: string;
  number_of_seasons: number;
  overview: string;
  poster_path: string;
  vote_average: number;
}

export type MovieActionTypes =
  | FetchTopMoviesAction
  | FetchTopTVAction
  | FetchCurrentMovieAction
  | FetchCurrentTVAction;
