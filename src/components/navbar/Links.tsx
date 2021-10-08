import React from "react";
import { Container } from "@mui/material";
import { NavLink } from "react-router-dom";

interface Props {
  mobile?: boolean;
  onClose: () => void;
}

const Links = ({ mobile = false, onClose }: Props): JSX.Element => {
  return (
    <Container
      className={`navbar__links-container${mobile && "--mobile"}`}
      onClick={onClose}
    >
      <NavLink activeClassName="navbar__active" exact to="/" className="navbar__link">
        Discover
      </NavLink>
      <NavLink activeClassName="navbar__active" to="/tv-shows" className="navbar__link">
        TV Shows
      </NavLink>
      <NavLink activeClassName="navbar__active" to="/movies" className="navbar__link">
        Movies
      </NavLink>
    </Container>
  );
};

export default Links;
