import { LOGIN, LOGOUT, AuthActionTypes } from "../interfaces/auth.redux.i";
import { AuthState } from "../interfaces/app.i";

const defaultState: AuthState = {
  uid: null,
};

export default (state = defaultState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        uid: action.uid,
      };
    case LOGOUT:
      return {
        uid: null,
      };
    default:
      return state;
  }
};
