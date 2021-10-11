import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CircularProgress,
  Container,
  createTheme,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TopMedia from "./TopMedia";
import DiscoveryForm from "./Discover";
import Modal from "../common/Modal";
import Button from "../../util/MuiButton";
import dayjs from "dayjs";
import { MediaProps, MediaState } from "./interfaces/Media.i";

const Media: React.FC<MediaProps> = ({ type }): JSX.Element => {
  const [state, setState] = useState<MediaState>({
    results: null,
    page: 1,
    error: "",
    query: "",
    maxPages: 1,
    discover: true,
    queryURL: null,
  });

  const theme = createTheme();
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [isSearching, setSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // mediaID is used for retrieving data from API when opening Modal component
  const [mediaID, setMediaID] = useState<number | null>(null);

  /**
   * Function to call the tmdb API with either a URL with a query (if passed down from the
   * DiscoveryForm component), or a search query URL if not. The results are stored into state
   * in as results.
   * @param queryURL - optional query url which will be passed from DiscoveryForm component that
   * can be called to return an array of results based on the query
   * @returns an array of the results stored into state
   */
  const handleSearch = async (queryURL?: string): Promise<void> => {
    const { page, query } = state;
    setSearching(true);
    setState({ ...state, results: null });
    if (queryURL) {
      const res = await axios.get(`${queryURL}&page=${page}`);
      setState({
        ...state,
        results: res.data.results,
        maxPages: res.data.total_pages,
        queryURL,
      });
      setSearching(false);
      return;
    }
    if (!query) {
      setState({ ...state, error: "Please enter a valid search" });
      return;
    }

    const url = `${process.env.TMDB_URL}/search/${type}${process.env.TMDB_API_KEY}`;
    const search = `${url}&query=${query}&page=${page}&sort_by=popularity.desc`;
    const res = await axios.get(encodeURI(search));
    setState({
      ...state,
      results: res.data.results,
      queryURL: null,
      maxPages: res.data.total_pages,
    });
    setSearching(false);
  };

  const handleLoadMorePosts = async (): Promise<void> => {
    const { queryURL, page, maxPages } = state;
    if (!queryURL && query) {
      const url = `${process.env.TMDB_URL}/search/${type}${process.env.TMDB_API_KEY}`;
      const res = await axios.get(
        `${url}&query=${query}&page=${page + 1}&sort_by=popularity.desc`,
      );
      setState({
        ...state,
        results: res.data.results,
        queryURL: null,
        maxPages: res.data.total_pages,
        page: page + 1,
      });
      return;
    }
    if (queryURL && page + 1 <= maxPages) {
      const res = await axios.get(`${queryURL}&page=${page + 1}`);
      setState({
        ...state,
        results: res.data.results,
        maxPages: res.data.total_pages,
        page: page + 1,
      });
    }
    // scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { results, discover, page, query, maxPages } = state;
  return (
    <>
      <div className="app__container">
        <Container>
          <Typography variant="h4" className="discover__title" gutterBottom>
            {type === "tv" ? "TV Shows" : "Movies"}
          </Typography>
          <Typography className="discover__text">
            Discover new {type === "tv" ? "TV shows " : "movies "} by clicking the
            &quot;Discover&quot; button, or alternatively click the &quot;Search by
            Name&quot; tab to search for a specific {type === "tv" ? "show." : "movie."}
          </Typography>
          <div className="media__search--buttons">
            <Button
              onClick={(): void => setState({ ...state, discover: true })}
              variant={discover ? "contained" : "outlined"}
              color="error"
              className={`media__search${discover && "--active"}`}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              Discover
            </Button>
            <Button
              onClick={(): void => setState({ ...state, discover: false })}
              color="error"
              variant={discover ? "outlined" : "contained"}
              className={`media__search${!discover && "--active"}`}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              Search by Name
            </Button>
          </div>
          {discover ? (
            <DiscoveryForm
              type={type}
              handleSearch={(query: string) => handleSearch(query)}
            />
          ) : (
            <div className="media__search--container">
              <Typography
                className="media__text"
                style={{ margin: "10px 0 16px", textAlign: "center" }}
                gutterBottom
              >
                Enter your desired search query below, and we&apos;ll find the closest
                matches!
              </Typography>
              <div className="media__input--container">
                <TextField
                  variant="outlined"
                  label="Search Query"
                  value={query}
                  className="media__input"
                  onChange={(e) => setState({ ...state, query: e.target.value })}
                />
                <Button
                  variant="contained"
                  color="error"
                  disableElevation
                  onClick={() => handleSearch()}
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    height: 56,
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          )}
          <Grid container spacing={2}>
            {results?.map(
              (media): JSX.Element => (
                <Grid item key={media.id} xs={12} sm={4} md={3}>
                  <Card
                    style={{
                      backgroundColor: "#333",
                      color: "white",
                      width: mobile ? "85%" : "100%",
                      margin: "0 auto",
                    }}
                    onClick={() => {
                      setMediaID(media.id);
                      setModalOpen(true);
                    }}
                  >
                    <div className="media__header">
                      <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                        {type === "tv" ? media.name : media.title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        ({dayjs(media.first_air_date).year()})
                      </Typography>
                    </div>
                    <CardMedia
                      component="img"
                      src={
                        media.poster_path
                          ? `http://image.tmdb.org/t/p/w300/${media.poster_path}`
                          : "https://www.rspcansw.org.au/wp-content/themes/noPhotoFound.png"
                      }
                    />
                  </Card>
                </Grid>
              ),
            )}
            {isSearching && (
              <CircularProgress
                color="primary"
                style={{ margin: "25vh auto", width: "4rem", height: "4rem" }}
              />
            )}
            {!results && (
              <Container style={{ marginTop: 30 }}>
                <h1 className="media__title">
                  Popular {type === "tv" ? "TV Shows" : "Movies"}
                </h1>
                <TopMedia type={type} />
              </Container>
            )}
            {results && page + 1 <= maxPages && (
              <div className="media__loadButton">
                <Button color="error" variant="outlined" onClick={handleLoadMorePosts}>
                  Load More Posts
                </Button>
              </div>
            )}
          </Grid>
        </Container>
      </div>

      {modalOpen && mediaID && (
        <Modal
          isOpen={modalOpen}
          closeModal={(): void => setModalOpen(false)}
          id={mediaID}
          type={type}
        />
      )}
    </>
  );
};

export default Media;
