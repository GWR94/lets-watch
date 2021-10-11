import React from "react";
import { useMediaQuery } from "@mui/material";
import Coverflow from "react-coverflow";
import Card from "./Card";
import { TmdbMovieResult, TmdbTVResult } from "../media/interfaces/Media.i";

interface CarouselProps {
  media: TmdbMovieResult[] | TmdbTVResult[];
  type: "movie" | "tv";
}

const Carousel: React.FC<CarouselProps> = ({ media, type }) => {
  const desktop = useMediaQuery("(min-width: 600px)");
  return (
    <Coverflow
      enableScroll
      clickable
      style={{ background: "none" }}
      displayQuantityOfSide={desktop ? 2 : 1}
      currentFigureScale={1}
      otherFigureScale={0.8}
      media={{
        "@media (max-width: 600px)": {
          height: "200px",
          width: "100%",
        },
        "@media (min-width: 600px)": {
          height: "300px",
          width: "100%",
        },
        "@media (min-width: 900px)": {
          height: "400px",
          width: "100%",
        },
      }}
    >
      {media.map(
        (show): JSX.Element => {
          return (
            <Card
              id={show.id}
              key={show.id}
              posterLink={show.poster_path}
              title={show.title || show.name}
              type={type}
            />
          );
        },
      )}
    </Coverflow>
  );
};

export default Carousel;
