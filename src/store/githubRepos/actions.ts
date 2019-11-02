import {
  GithubRepoType,
  FetchGithubReposActionTypes,
  FETCH_REPOS_REQUESTED,
  FETCH_REPOS_SUCCESSFUL,
  FETCH_REPOS_FAILED,
} from './types';

export function fetchRepos(username: string): FetchGithubReposActionTypes {
  return {
    type: FETCH_REPOS_REQUESTED,
    payload: username,
  };
}

export function fetchReposFailed(payload: any): FetchGithubReposActionTypes {
  return {
    type: FETCH_REPOS_FAILED,
    payload,
  };
}

export function fetchReposSuccessful(
  payload: GithubRepoType[]
): FetchGithubReposActionTypes {
  return {
    type: FETCH_REPOS_SUCCESSFUL,
    payload,
  };
}
