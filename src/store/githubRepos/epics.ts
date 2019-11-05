import { Epic, ofType, combineEpics } from 'redux-observable';
import {
  map,
  catchError,
  switchMap,
  pluck,
  withLatestFrom,
} from 'rxjs/operators';
import {
  FETCH_REPOS_REQUESTED,
  GithubRepoType,
  FetchGithubReposActionTypes,
} from './types';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { fetchReposSuccessful, fetchReposFailed, fetchRepos } from './actions';
import {
  UPDATE_SELECTED_USER,
  UpdateSelectedUserAction,
} from '../selectedUser';
import { AppState } from '..';

export const fetchGithubRepos = (
  username: string,
  getJSON: (typeof ajax)['getJSON']
) =>
  getJSON<GithubRepoType[]>(
    `https://api.github.com/users/${username}/repos`
  ).pipe(
    map(fetchReposSuccessful),
    catchError(error => of(fetchReposFailed(error)))
  );

export const fetchGithubReposEpic: Epic<
  FetchGithubReposActionTypes,
  FetchGithubReposActionTypes,
  AppState
> = (action$, state$, { getJSON }) =>
  action$.pipe(
    ofType(FETCH_REPOS_REQUESTED),
    pluck('payload'),
    switchMap(payload => fetchGithubRepos(payload, getJSON))
  );

export const listenToSelectedUserEpic: Epic<
  UpdateSelectedUserAction | FetchGithubReposActionTypes,
  FetchGithubReposActionTypes,
  AppState
> = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_SELECTED_USER),
    withLatestFrom(state$),
    map(([action, state]) => state.selectedUser),
    map(username => fetchRepos(username))
  );

export const githubReposEpics = combineEpics(
  fetchGithubReposEpic,
  listenToSelectedUserEpic
);
