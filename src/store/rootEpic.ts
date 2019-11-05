import { combineEpics } from 'redux-observable';
import { fetchGithubUserEpic } from './githubUsers';
import { githubReposEpics } from './githubRepos';
import { updateSelectedUserEpic } from './selectedUser';

export const rootEpic = combineEpics(
  fetchGithubUserEpic,
  updateSelectedUserEpic,
  githubReposEpics
);
