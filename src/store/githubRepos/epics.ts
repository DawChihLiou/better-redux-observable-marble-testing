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

/**
 * Takes github username and RxJS ajax.getJSON as parameters to fetch given
 * user's public repos and dispatch Redux actions according to whether the
 * API request was successful.
 *
 * You can find `GithubRepoType` here:
 * https://github.com/DawChihLiou/better-redux-observable-marble-testing/blob/master/src/store/githubRepos/types.ts#L31
 *
 * For more info about Github's public REST API, please check out
 * https://developer.github.com/v3/repos/#list-user-repositories
 *
 * @param username {string}
 * @param getJSON  {function}
 * @returns {Observable}
 */
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

/**
 * Listens to fetch github repos request action and execute fetch.
 *
 * You can find `FetchGithubReposActionTypes` here:
 * https://github.com/DawChihLiou/better-redux-observable-marble-testing/blob/master/src/store/githubRepos/types.ts#L20
 *
 * @param action$ {ActionsObservable}
 * @param state$ {StateObservable}
 * @param dependencies {Object}
 * @returns {Observable}
 */
export const fetchGithubReposEpic: Epic<
  FetchGithubReposActionTypes,
  FetchGithubReposActionTypes,
  AppState
> = (action$, state$, { getJSON }) =>
  action$.pipe(
    ofType(FETCH_REPOS_REQUESTED),
    pluck<FetchGithubReposActionTypes, string>('payload'),
    switchMap(payload => fetchGithubRepos(payload, getJSON))
  );

/**
 * Listens to fetch update selected user action. Combining with the newly
 * updated selected user in the store, we dispatch fetch repos action to
 * trigger fetch.
 *
 * You can find action types here:
 * https://github.com/DawChihLiou/better-redux-observable-marble-testing/blob/master/src/store/githubRepos/types.ts
 *
 * @param action$ {ActionsObservable}
 * @param state$ {StateObservable}
 * @param dependencies {Object}
 * @returns {Observable}
 */
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
