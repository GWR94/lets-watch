import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as tmdbActions from "../../actions/tmdb.actions";
import Carousel from "../common/Carousel";
import { AppState } from "../../interfaces/app.i";

interface Props {
  type: "movie" | "tv";
}

const TopMedia: React.FC<Props> = ({ type }): JSX.Element => {
  const media = useSelector(({ tmdb }: AppState) => tmdb[type]);
  const dispatch = useDispatch();

  console.log(type);

  useEffect((): void => {
    type === "tv"
      ? dispatch(tmdbActions.fetchTopTV())
      : dispatch(tmdbActions.fetchTopMovies());
  }, []);

  return media ? <Carousel media={media} type={type} /> : null;
};

export default TopMedia;
