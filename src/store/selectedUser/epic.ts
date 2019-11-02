import { Epic, ofType } from 'redux-observable';
import { pluck, map } from 'rxjs/operators';
import { FETCH_USERS_SUCCESSFUL } from '../githubUsers';
import { updateSelectedUser } from './actions';

export const updateSelectedUserEpic: Epic = action$ =>
  action$.pipe(
    ofType(FETCH_USERS_SUCCESSFUL),
    pluck('payload'),
    map(users => users[0].login),
    map(updateSelectedUser)
  );
