export interface AppState {
  auth?: AuthState;
  tmdb?: TMDBState;
}

export interface AuthState {
  uid: string;
}

export interface TMDBState {
  movie: any;
  tv: any;
  current: any;
}
