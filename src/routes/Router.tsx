import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { connect } from "react-redux";
import Home from "../components/landing/Home";
import NotFoundPage from "../components/NotFoundPage";
import Login from "../components/landing/Login";
import { AuthState, ProfileState, AppState } from "../interfaces/app.i";
import * as actions from "../actions/auth.actions";
import PrivateRoute from "./PrivateRoute";
import Account from "../components/account/Account";

export const history = createBrowserHistory();

interface RouterProps {
  auth: AuthState;
  profile: ProfileState;
  fetchUser: () => void;
}

class AppRouter extends Component<RouterProps> {
  constructor(props) {
    super(props);
    const { fetchUser } = this.props;
    fetchUser();
  }

  public render(): JSX.Element {
    const {
      auth: { profile },
    } = this.props;
    const isAuth = !!profile;
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={isAuth ? Home : Login} />
          {/* <Route path="/movies" component={Movies} />
          <Route path="/tv-shows" component={TVShows} /> */}
          <PrivateRoute auth={isAuth} path="/account" component={Account} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = ({ auth }): AppState => ({ auth });

export default connect(mapStateToProps, actions)(AppRouter);
