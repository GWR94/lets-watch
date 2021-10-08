import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "../common/Carousel";

interface Props {
  type: "tv" | "movie";
  media: number[];
}

const WatchLater = ({ type, media }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
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
    <Carousel media={data} type={type} />
  );
};

export default WatchLater;
