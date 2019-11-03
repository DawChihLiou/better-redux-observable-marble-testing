import { Epic, ofType } from 'redux-observable';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  FETCH_USERS_REQUESTED,
  GithubUserType,
  FetchGithubUsersActionTypes,
} from './types';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { fetchUsersSuccessful, fetchUsersFailed } from './actions';
import { AppState } from '..';
import { AllActionTypes } from '../types';

const fetchGithubUsers = () =>
  ajax.getJSON<GithubUserType[]>('https://api.github.com/users').pipe(
    map(fetchUsersSuccessful),
    catchError(error => of(fetchUsersFailed(error)))
  );

export const fetchGithubUserEpic: Epic<
  AllActionTypes,
  FetchGithubUsersActionTypes,
  AppState
> = action$ =>
  action$.pipe(
    ofType(FETCH_USERS_REQUESTED),
    switchMap(fetchGithubUsers)
  );
