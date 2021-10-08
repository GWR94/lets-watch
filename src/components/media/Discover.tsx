import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Typography,
  Slider,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { categories } from "../../util/data";
import Button from "../../util/MuiButton";

export enum SortBy {
  Popularity = "popularity.desc",
  Rating = "vote_average.desc",
  Newest_Releases = "first_air_date.desc",
  Oldest_Releases = "first_air_date.asc",
}

interface DiscoverProps {
  type: "movie" | "tv";
  handleSearch: (query: string) => void;
}

interface DiscoverState {
  sortBy: string;
  year: [number, number];
  minRating: number;
  prefGenre: string;
  avoidGenre: string;
  error: string;
  maxPages: number;
  page: number;
  query: string;
}

const DiscoverForm = ({ type, handleSearch }: DiscoverProps): JSX.Element => {
  const [state, setState] = useState<DiscoverState>({
    prefGenre: "",
    avoidGenre: "",
    year: [1930, 2021],
    sortBy: "popularity.desc",
    minRating: 2.5,
    error: "",
    maxPages: null,
    page: 1,
    query: "",
  });

  const buildSearchQuery = (): void => {
    const url = `${process.env.TMDB_URL}/discover/${type}${process.env.TMDB_API_KEY}`;
    const { sortBy, year, minRating, prefGenre, avoidGenre } = state;
    if (prefGenre && avoidGenre && prefGenre === avoidGenre) {
      setState({
        ...state,
        error: "You cannot prefer and avoid the same genre",
      });
      return;
    }
    const query = `${prefGenre && `&with_genres=${prefGenre}`}${avoidGenre &&
      `&without_genres=${avoidGenre}`}&vote_average.gte=${minRating *
      2}&sort_by=${sortBy}&first_air_date.gte=${year[0]}-01-01&first_air_date.lte=${
      year[1]
    }-01-01`;
    handleSearch(`${url}${query}`);
  };

  const { prefGenre, avoidGenre, year, sortBy, minRating, error } = state;

  return (
    <div className="discover__container">
      <Typography variant="h5" className="discover__font">
        Discover New Titles
      </Typography>
      <Typography variant="subtitle2" gutterBottom className="discover__font">
        Select your preferences below and we&apos;ll whip up some of the best matches!
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel variant="outlined" className="discover__input--root">
              Preferred Genre
            </InputLabel>
            <Select
              type="select"
              variant="outlined"
              error={!!error}
              label="Preferred Genre"
              value={prefGenre}
              fullWidth
              className="media__text"
              onChange={(e): void =>
                setState({ ...state, prefGenre: e.target.value as string })
              }
            >
              <MenuItem value="" />
              {categories[type].map(({ value, title }, i) => (
                <MenuItem key={i} value={value}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel variant="outlined" className="discover__input--root">
              Genre to Avoid
            </InputLabel>
            <Select
              value={avoidGenre}
              className="media__text"
              error={!!error}
              variant="outlined"
              fullWidth
              label="Genre to Avoid"
              onChange={(e): void =>
                setState({
                  ...state,
                  avoidGenre: e.target.value as string,
                  error: null,
                })
              }
            >
              <MenuItem value="" />
              {categories[type].map(({ value, title }, i) => (
                <MenuItem key={i} value={value}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {!!error && (
          <FormHelperText error className="discover__error">
            {error}
          </FormHelperText>
        )}
      </Grid>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={6} height={80} justifyContent="center">
          <div className="discover__rating--container">
            <Typography>Min Rating: </Typography>
            <FormControl variant="outlined">
              <Rating
                value={minRating}
                defaultValue={2.5}
                name="Minimum Rating"
                onChange={(_e, minRating) => setState({ ...state, minRating })}
                precision={0.5}
                style={{ marginLeft: 10 }}
              />
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} height={80}>
          <div className="discover__years">
            <Typography>Year: </Typography>
            <Slider
              value={year}
              onChange={(e_, year) =>
                setState({ ...state, year: year as [number, number] })
              }
              step={1}
              min={1930}
              color="secondary"
              valueLabelDisplay="on"
              max={2021}
              style={{ marginLeft: 20 }}
            />
          </div>
        </Grid>
      </Grid>
      <div className="discover__button--container">
        <FormControl variant="outlined">
          <InputLabel variant="outlined" className="discover__input--root">
            Sort By
          </InputLabel>
          <Select
            variant="outlined"
            label="Sort By"
            value={sortBy}
            className="media__text"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              width: 220,
            }}
            onChange={(e): void =>
              setState({ ...state, sortBy: e.target.value as string })
            }
          >
            <MenuItem value={SortBy.Popularity}>Popularity</MenuItem>
            <MenuItem value={SortBy.Rating}>Rating</MenuItem>
            <MenuItem value={SortBy.Newest_Releases}>Newest Releases</MenuItem>
            <MenuItem value={SortBy.Oldest_Releases}>Oldest Releases</MenuItem>
          </Select>
        </FormControl>
        <Button
          color="error"
          variant="contained"
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: 54 }}
          onClick={buildSearchQuery}
          disableElevation
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default DiscoverForm;
