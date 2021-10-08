import { compose, createStore, combineReducers, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import authReducer from "../reducers/auth.reducer";
import tmdbReducer from "../reducers/tmdb.reducer";
import { AppState } from "../interfaces/app.i";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";
declare global {
  interface Window {
    // eslint-disable-next-line no-undef
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export default (): { store: Store; persistor: Persistor } => {
  const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
  };
  const reducer = combineReducers({
    auth: authReducer,
    tmdb: tmdbReducer,
  });

  const persistedReducer = persistReducer(persistConfig, reducer);
  const store: Store<AppState> = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk)),
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
