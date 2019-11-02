import { Epic, ofType } from 'redux-observable';
import {
  map,
  catchError,
  switchMap,
  pluck,
  withLatestFrom,
  tap,
} from 'rxjs/operators';
import { FETCH_REPOS_REQUESTED, GithubRepoType } from './types';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { fetchReposSuccessful, fetchReposFailed, fetchRepos } from './actions';
import { UPDATE_SELECTED_USER } from '../selectedUser';

const fetchGithubRepos = (username: string) =>
  ajax
    .getJSON<GithubRepoType[]>(`https://api.github.com/users/${username}/repos`)
    .pipe(
      map(response => fetchReposSuccessful(response)),
      catchError(error => of(fetchReposFailed(error)))
    );

export const fetchGithubReposEpic: Epic = action$ =>
  action$.pipe(
    ofType(FETCH_REPOS_REQUESTED),
    pluck('payload'),
    switchMap(fetchGithubRepos)
  );

export const listenToSelectedUser: Epic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_SELECTED_USER),
    withLatestFrom(state$),
    map(([action, state]) => state.selectedUser),
    tap(console.log),
    map(username => fetchRepos(username))
  );
