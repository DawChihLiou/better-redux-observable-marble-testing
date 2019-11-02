import { combineEpics } from 'redux-observable';
import { fetchGithubUserEpic } from './githubUsers';
import { fetchGithubReposEpic, listenToSelectedUser } from './githubRepos';
import { updateSelectedUserEpic } from './selectedUser';

export const rootEpic = combineEpics(
  fetchGithubUserEpic,
  fetchGithubReposEpic,
  updateSelectedUserEpic,
  listenToSelectedUser
);
