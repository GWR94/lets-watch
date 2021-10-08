import {
  FETCH_TOP_MOVIES,
  FETCH_TOP_TV,
  FETCH_CURRENT_MOVIE,
  FETCH_CURRENT_TV,
  MovieActionTypes,
} from "../interfaces/tmdb.redux.i";
import { TMDBState } from "../interfaces/app.i";

const defaultState: TMDBState = {
  movie: null,
  tv: null,
  current: null,
};

export default (state = defaultState, action: MovieActionTypes): TMDBState => {
  switch (action.type) {
    case FETCH_TOP_MOVIES:
      return {
        ...state,
        movie: action.payload || null,
      };
    case FETCH_TOP_TV:
      return {
        ...state,
        tv: action.payload || null,
      };
    case FETCH_CURRENT_MOVIE: {
      const {
        id,
        title,
        tagline,
        genres,
        overview,
        vote_average,
        language,
        homepage,
        backdrop_path,
        poster_path,
        release_date,
      } = action.payload;
      return {
        ...state,
        current: {
          id,
          title,
          tagline,
          genres: genres.map(({ name }) => name),
          overview,
          rating: vote_average,
          language,
          homepage,
          backdrop: backdrop_path,
          poster: poster_path,
          releaseDate: release_date,
        },
      };
    }
    case FETCH_CURRENT_TV: {
      const {
        id,
        name,
        backdrop_path,
        first_air_date,
        language,
        genres,
        homepage,
        next_episode_to_air,
        number_of_seasons,
        overview,
        poster_path,
        vote_average,
      } = action.payload;
      return {
        ...state,
        current: {
          id,
          title: name,
          backdrop: backdrop_path,
          releaseDate: first_air_date,
          language,
          genres: genres.map(({ name }) => name),
          homepage,
          nextEpisode: next_episode_to_air,
          noSeasons: number_of_seasons,
          overview,
          poster: poster_path,
          rating: vote_average,
        },
      };
    }
    default:
      return state;
  }
};
