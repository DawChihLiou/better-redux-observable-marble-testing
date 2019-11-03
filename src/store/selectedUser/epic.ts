import { Epic, ofType } from 'redux-observable';
import { pluck, map } from 'rxjs/operators';
import {
  FETCH_USERS_SUCCESSFUL,
  FetchGithubUsersActionTypes,
  GithubUserType,
} from '../githubUsers';
import { updateSelectedUser } from './actions';
import { UpdateSelectedUserAction } from './types';
import { AppState } from '..';
import { AllActionTypes } from '../types';

export const updateSelectedUserEpic: Epic<
  AllActionTypes,
  UpdateSelectedUserAction,
  AppState
> = action$ =>
  action$.pipe(
    ofType<AllActionTypes, FetchGithubUsersActionTypes>(FETCH_USERS_SUCCESSFUL),
    pluck<FetchGithubUsersActionTypes, GithubUserType[]>('payload'),
    map(users => users[0].login),
    map(updateSelectedUser)
  );
