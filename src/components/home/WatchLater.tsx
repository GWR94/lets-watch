import { CircularProgress, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Button from "../../util/MuiButton";
import Carousel from "../common/Carousel";

interface Props {
  type: "tv" | "movie";
  media: number[];
}

const WatchLater = ({ type, media }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const arr = [];

    const requests = media.map((id) => {
      return new Promise((resolve, reject) => {
        try {
          axios
            .get(`${process.env.TMDB_URL}/${type}/${id}${process.env.TMDB_API_KEY}`)
            .then((res) => {
              console.log(res.data);
              resolve(res.data);
            });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
    });

    Promise.all(requests)
      .then((body) => {
        body.forEach((res) => {
          if (res) arr.push(res);
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setData(arr);
        setLoading(false);
      });
  }, []);

  return isLoading ? (
    <CircularProgress size={20} />
  ) : (
    <Container>
      <Typography variant="h6" className="discover__title">
        Your Saved {type === "tv" ? "TV Shows" : "Movies"}
      </Typography>
      {data.length > 0 ? (
        <Carousel media={data} type={type} />
      ) : (
        <div className="watch__no-results--container">
          <Typography>No saved {type === "tv" ? "tv shows." : "movies."}</Typography>
          <Button
            onClick={() => history.push(type === "tv" ? "/tv-shows" : "movies")}
            color="secondary"
          >
            View {type === "tv" ? "TV Shows" : "Movies"}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WatchLater;
