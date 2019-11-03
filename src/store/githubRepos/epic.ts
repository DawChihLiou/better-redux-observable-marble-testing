import { Epic, ofType } from 'redux-observable';
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
import { UPDATE_SELECTED_USER } from '../selectedUser';
import { AppState } from '..';

import { AllActionTypes } from '../types';

const fetchGithubRepos = (username: string) =>
  ajax
    .getJSON<GithubRepoType[]>(`https://api.github.com/users/${username}/repos`)
    .pipe(
      map(fetchReposSuccessful),
      catchError(error => of(fetchReposFailed(error)))
    );

export const fetchGithubReposEpic: Epic<
  FetchGithubReposActionTypes,
  FetchGithubReposActionTypes,
  AppState
> = action$ =>
  action$.pipe(
    ofType(FETCH_REPOS_REQUESTED),
    pluck('payload'),
    switchMap(fetchGithubRepos)
  );

export const listenToSelectedUserEpic: Epic<
  AllActionTypes,
  FetchGithubReposActionTypes,
  AppState
> = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_SELECTED_USER),
    withLatestFrom(state$),
    map(([action, state]) => state.selectedUser),
    map(username => fetchRepos(username))
  );
