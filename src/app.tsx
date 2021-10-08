import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { FC } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import configureStore from "./store/store";
import AppRouter from "./routes/Router";
import "./scss/styles.scss";
import "normalize.css";
import "animate.css/animate.min.css";
import awsExports from "./aws-exports";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PersistGate } from "redux-persist/integration/react";
import Notifier from "./util/Notifier";
import { isLocalhost, hasLocalhost, hasHostname } from "./util/index";

const { store, persistor } = configureStore();

const urlsIn = awsExports.oauth.redirectSignIn.split(",");
const urlsOut = awsExports.oauth.redirectSignOut.split(",");

const oauth = {
  domain: awsExports.oauth.domain,
  scope: awsExports.oauth.scope,
  redirectSignIn: awsExports.oauth.redirectSignIn,
  redirectSignOut: awsExports.oauth.redirectSignOut,
  responseType: awsExports.oauth.responseType,
};

/**
 * Sets the correct oauth redirect sign-in/sign-out variables depending on
 * if the user is accessing from the localhost or production.
 */
if (isLocalhost) {
  urlsIn.forEach((e: string): void => {
    if (hasLocalhost(e)) {
      oauth.redirectSignIn = e; // will be localhost
    }
  });
  urlsOut.forEach((e: string): void => {
    if (hasLocalhost(e)) {
      oauth.redirectSignOut = e; // will be localhost
    }
  });
} else {
  urlsIn.forEach((e: string): void => {
    if (hasHostname(e)) {
      oauth.redirectSignIn = e; // will be xxx.amplifyapp.com
    }
  });
  urlsOut.forEach((e: string): void => {
    if (hasHostname(e)) {
      oauth.redirectSignOut = e; // will be xxx.amplifyapp.com
    }
  });
}

const configUpdate = awsExports;
configUpdate.oauth = oauth;

Amplify.configure({
  ...configUpdate,
  Auth: {
    mandatorySignIn: false,
  },
});

const App: FC = (): JSX.Element => {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <div className="app__container">
            <Notifier />
            <AppRouter />
          </div>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
