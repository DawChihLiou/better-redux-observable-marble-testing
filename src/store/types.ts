import { UpdateSelectedUserAction } from './selectedUser';
import { FetchGithubReposActionTypes } from './githubRepos';
import { FetchGithubUsersActionTypes } from './githubUsers';

export type AllActionTypes =
  | UpdateSelectedUserAction
  | FetchGithubReposActionTypes
  | FetchGithubUsersActionTypes;
