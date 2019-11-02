import { Epic, ofType } from 'redux-observable';
import { map, catchError, switchMap } from 'rxjs/operators';
import { FETCH_USERS_REQUESTED, GithubUserType } from './types';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { fetchUsersSuccessful, fetchUsersFailed } from './actions';

const fetchGithubUsers = () =>
  ajax.getJSON<GithubUserType[]>('https://api.github.com/users').pipe(
    map(response => fetchUsersSuccessful(response)),
    catchError(error => of(fetchUsersFailed(error)))
  );

export const fetchGithubUserEpic: Epic = action$ =>
  action$.pipe(
    ofType(FETCH_USERS_REQUESTED),
    switchMap(fetchGithubUsers)
  );
