import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  LogoutRounded,
  MenuRounded,
  PersonRounded,
  TvRounded,
} from "@mui/icons-material";
import {
  AppBar,
  ClickAwayListener,
  Collapse,
  Container,
  createTheme,
  Divider,
  ListItemIcon,
  Menu,
  MenuList,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as actions from "../../actions/auth.actions";
import { LogoutAction } from "../../interfaces/auth.redux.i";
import Links from "./Links";
import { AppState } from "../../interfaces/app.i";
import LoginModal from "../common/LoginModal";

const NavBar = (): JSX.Element => {
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { uid } = useSelector(({ auth }: AppState) => auth);

  const history = useHistory();
  const dispatch = useDispatch();

  const theme = createTheme();
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <>
      <ClickAwayListener onClickAway={(): void => setNavOpen(false)}>
        <AppBar
          className="animate__animated animate__slideInDown navbar__container"
          position="relative"
          elevation={4}
          color="transparent"
        >
          <Container>
            {mobile ? (
              <div className="navbar__links">
                <div className="navbar__icon--container">
                  <TvRounded className="navbar__icon" />
                  <Typography
                    className="media__text"
                    style={{ marginLeft: 5, color: "rgba(255,255,255,0.6)" }}
                  >
                    Lets Watch
                  </Typography>
                </div>
                <MenuRounded
                  className="navbar__menu"
                  onClick={(): void => setNavOpen(!navOpen)}
                />
              </div>
            ) : (
              <div className="navbar__links">
                <Links onClose={() => setNavOpen(false)} />
                <div
                  tabIndex={0}
                  role="button"
                  className="navbar__profileIcon"
                  onClick={(e) => {
                    if (uid) {
                      setAnchorEl(e.currentTarget);
                      setMenuOpen(true);
                    } else {
                      setLoginOpen(true);
                    }
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    alt="Profile"
                    className="navbar__img"
                  />
                  {uid ? "Account" : "Login"}
                </div>
                <Menu
                  open={menuOpen}
                  anchorEl={anchorEl}
                  onClose={(): void => setMenuOpen(false)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: -140,
                  }}
                  className="navbar__menu"
                >
                  <MenuList
                    className="navbar__menuItem"
                    onClick={() => {
                      setMenuOpen(false);
                      setNavOpen(false);
                      history.push("/profile");
                    }}
                  >
                    <ListItemIcon className="navbar__menuIcon">
                      <PersonRounded />
                    </ListItemIcon>
                    <div role="button" tabIndex={0} className="navbar__menu--link">
                      Profile
                    </div>
                  </MenuList>
                  <Divider />
                  <MenuList className="navbar__menuItem">
                    <ListItemIcon className="navbar__menuIcon">
                      <LogoutRounded />
                    </ListItemIcon>
                    <div
                      onClick={(): LogoutAction => {
                        setMenuOpen(false);
                        setNavOpen(false);
                        return dispatch(actions.logout());
                      }}
                    >
                      Logout
                    </div>
                  </MenuList>
                </Menu>
              </div>
            )}
            {mobile && (
              <Collapse in={navOpen}>
                <Links mobile onClose={() => setNavOpen(false)} />
                <Divider style={{ margin: "5px 0" }} />
                <div className="navbar__collapsed--links">
                  {uid ? (
                    <>
                      <div
                        className="navbar__link"
                        tabIndex={0}
                        role="button"
                        onClick={() => {
                          history.push("/profile");
                          setMenuOpen(false);
                          setNavOpen(false);
                        }}
                      >
                        Profile
                      </div>
                      <div
                        className="navbar__link"
                        onClick={(): LogoutAction => {
                          setMenuOpen(false);
                          setNavOpen(false);
                          return dispatch(actions.logout());
                        }}
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <div
                      className="navbar__link"
                      onClick={() => {
                        setLoginOpen(true);
                        setNavOpen(false);
                      }}
                    >
                      Login
                    </div>
                  )}
                </div>
              </Collapse>
            )}
          </Container>
        </AppBar>
      </ClickAwayListener>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default NavBar;
