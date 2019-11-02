import {
  GithubUserType,
  FetchGithubUsersActionTypes,
  FETCH_USERS_REQUESTED,
  FETCH_USERS_SUCCESSFUL,
  FETCH_USERS_FAILED,
} from './types';

export function fetchUsers(): FetchGithubUsersActionTypes {
  return {
    type: FETCH_USERS_REQUESTED,
  };
}

export function fetchUsersFailed(payload: any): FetchGithubUsersActionTypes {
  return {
    type: FETCH_USERS_FAILED,
    payload,
  };
}

export function fetchUsersSuccessful(
  payload: GithubUserType[]
): FetchGithubUsersActionTypes {
  return {
    type: FETCH_USERS_SUCCESSFUL,
    payload,
  };
}
