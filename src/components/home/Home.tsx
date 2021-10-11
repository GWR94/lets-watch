import React from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "../navbar/NavBar";
import TopMedia from "../media/TopMedia";
import Button from "../../util/MuiButton";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../interfaces/app.i";

const Home: React.FC = (): JSX.Element => {
  const history = useHistory();
  const { uid } = useSelector(({ auth }: AppState) => auth);

  return (
    <div className="home__container">
      <Container style={{ paddingTop: 20 }}>
        <Typography variant="h4" className="discover__title" gutterBottom>
          What's Going On...
        </Typography>
        <p className="home__saved">
          Have a browse through the top watched TV & Movies, or search for some unknown
          gems by clicking below!
        </p>
        {uid && (
          <p className="home__saved">View your saved shows from the Profile tab.</p>
        )}
        <div className="home__button--container">
          <Button
            variant="outlined"
            color="error"
            size="small"
            style={{ margin: "0 3px" }}
            onClick={() => history.push("/tv-shows")}
          >
            Discover TV Shows
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            style={{ margin: "0 3px" }}
            onClick={() => history.push("/movies")}
          >
            Discover Movies
          </Button>
        </div>
        <p className="home__text">
          Here are the most popular things to watch right now...
        </p>
        <h2 className="home__title">Popular Movies</h2>
        <TopMedia type="movie" />
        <h2 className="home__title">Popular TV Shows</h2>
        <TopMedia type="tv" />
      </Container>
    </div>
  );
};

export default Home;
