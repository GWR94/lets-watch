export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";
export interface LoginAction {
  type: typeof LOGIN;
  uid: string;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = LogoutAction | LoginAction;
