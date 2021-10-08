import React, { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import { API, graphqlOperation, Hub } from "aws-amplify";
import NotFoundPage from "../components/common/NotFoundPage";
import Home from "../components/home/Home";
import Login from "../components/common/LoginModal";
import PopularMedia from "../components/media/Media";
import { AppState } from "../interfaces/app.i";
import { getUser } from "../graphql/queries";
import { createUser } from "../graphql/mutations";
import * as actions from "../actions/auth.actions";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { User } from "../API";
import Profile from "../components/home/Profile";
import NavBar from "../components/navbar/NavBar";

const AppRouter: React.FC = (): JSX.Element => {
  const history = createBrowserHistory();
  const { uid } = useSelector(({ auth }: AppState) => auth);

  const dispatch = useDispatch();

  const getUserData = async (id: string): Promise<User> => {
    const { data } = (await API.graphql({
      query: getUser,
      variables: {
        id,
      },
      authMode: "AWS_IAM",
    })) as GraphQLResult<{ getUser: User }>;
    return data?.getUser ?? null;
  };

  const handleAuthentication = async (signInData): Promise<void> => {
    const id =
      signInData?.attributes?.sub ??
      signInData?.id ??
      signInData?.signInUserSession?.idToken?.payload?.sub;
    const name = signInData?.signInUserSession.idToken.payload["cognito:username"];
    const { email } = signInData?.signInUserSession.idToken.payload;
    dispatch(actions.login(id));
    const user = await getUserData(id);
    console.log(user);
    if (user) return;
    try {
      /**
       * spread the getUserInput object into a new variable, and add the username and email
       * from signInData to it. Then set registered to true so the database holds valid
       * information.
       */
      const registerUserInput = {
        id,
        username: name,
        email,
        tvShows: [],
        movies: [],
      };
      // execute the registerUser mutation to add the user to the database.
      await API.graphql(
        graphqlOperation(createUser, {
          input: registerUserInput,
        }),
      );
    } catch (err) {
      // log any errors
      console.error(err);
    }
  };

  const onHubCapsule = async (capsule): Promise<void> => {
    switch (capsule.payload.event) {
      case "signIn": {
        await handleAuthentication(capsule.payload.data);
        break;
      }
      case "signOut":
        dispatch(actions.logout());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    Hub.listen("auth", onHubCapsule);
    return (): void => {
      Hub.remove("auth", onHubCapsule);
    };
  }, []);

  return (
    <Router history={history}>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/movies" component={() => <PopularMedia type="movie" />} />
        <Route path="/tv-shows" component={() => <PopularMedia type="tv" />} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
