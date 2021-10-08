import { LOGIN, LOGOUT, LoginAction, LogoutAction } from "../interfaces/auth.redux.i";

export const login = (uid: string): LoginAction => ({
  type: LOGIN,
  uid,
});

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});
