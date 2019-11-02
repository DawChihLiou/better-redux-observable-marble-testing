import { Reducer } from 'redux';
import {
  GithubReposState,
  FetchGithubReposActionTypes,
  FETCH_REPOS_REQUESTED,
  FETCH_REPOS_FAILED,
  FETCH_REPOS_SUCCESSFUL,
} from './types';

const initialState: GithubReposState = {
  isLoading: false,
  error: null,
  data: null,
};

export const githubReposReducer: Reducer<
  GithubReposState,
  FetchGithubReposActionTypes
> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPOS_REQUESTED: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_REPOS_FAILED: {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }
    case FETCH_REPOS_SUCCESSFUL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
