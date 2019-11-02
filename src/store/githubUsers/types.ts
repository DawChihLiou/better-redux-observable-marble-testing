export const FETCH_USERS_REQUESTED = 'FETCH_USERS_REQUESTED';
export const FETCH_USERS_SUCCESSFUL = 'FETCH_USERS_SUCCESSFUL';
export const FETCH_USERS_FAILED = 'FETCH_USERS_FAILED';

interface FetchUsersRequestedAction {
  type: typeof FETCH_USERS_REQUESTED;
}

interface FetchUsersSuccessfulAction {
  type: typeof FETCH_USERS_SUCCESSFUL;
  payload: GithubUserType[];
}

interface FetchUsersFailedAction {
  type: typeof FETCH_USERS_FAILED;
  payload: any;
}

export type FetchGithubUsersActionTypes =
  | FetchUsersRequestedAction
  | FetchUsersSuccessfulAction
  | FetchUsersFailedAction;

export interface GithubUsersState {
  isLoading: boolean;
  error: any;
  data: GithubUserType[] | null;
}

export interface GithubUserType {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
