import { TestScheduler } from 'rxjs/testing';
import { fetchReposSuccessful, fetchReposFailed, fetchRepos } from './actions';
import { GithubRepoType } from './types';
import { throwError, timer, Subject } from 'rxjs';
import {
  fetchGithubRepos,
  fetchGithubReposEpic,
  listenToSelectedUserEpic,
} from './epics';
import { mergeMap } from 'rxjs/operators';
import { updateSelectedUser } from '../selectedUser';
import { StateObservable } from 'redux-observable';
import { AppState } from '..';
import { reposInitialState } from './reducer';
import { usersInitialState } from '../githubUsers';

describe('fetchGithubRepos', () => {
  const response: GithubRepoType[] = [];
  const error = new Error('test error');
  const values = {
    r: response,
    s: fetchReposSuccessful(response),
    e: fetchReposFailed(error),
  };

  it('should signal fetching repos successfully', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ hot, cold, expectObservable }) => {
      const getJSON = (url: string) => cold('-r', values);
      const output$ = fetchGithubRepos('octocat', getJSON as any);
      expectObservable(output$).toBe('-s', values);
    });
  });

  it('should signal fetching repos has failed', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ hot, cold, expectObservable }) => {
      const duration = scheduler.createTime('-|');
      const getJSON = (url: string) =>
        timer(duration).pipe(mergeMap(() => throwError(error)));

      const output$ = fetchGithubRepos('octocat', getJSON as any);
      expectObservable(output$).toBe('-(e|)', values);
    });
  });
});

describe('fetchGithubReposEpic', () => {
  const response: GithubRepoType[] = [];
  const error = new Error('test error');
  const marbles = {
    a: '-a',
    r: '--r',
    s: '---s',
    f: '--|',
    e: '---e',
  };
  const values = {
    a: fetchRepos('octocat'),
    r: response,
    s: fetchReposSuccessful(response),
    e: fetchReposFailed(error),
  };

  it('should signal fetching repos successfully', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot(marbles.a, values) as any;
      const state$ = null as any;
      const dependencies = {
        getJSON: (url: string) => cold(marbles.r, values),
      };
      const output$ = fetchGithubReposEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.s, values);
    });
  });

  it('should signal fetching repos has failed', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ hot, expectObservable }) => {
      const action$ = hot(marbles.a, values) as any;
      const state$ = null as any;
      const duration = scheduler.createTime(marbles.f);
      const dependencies = {
        getJSON: (url: string) =>
          timer(duration).pipe(mergeMap(() => throwError(error))),
      };
      const output$ = fetchGithubReposEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.e, values);
    });
  });
});

describe('listenToSelectedUserEpic', () => {
  const response: GithubRepoType[] = [];
  const error = new Error('test error');
  const marbles = {
    a: '-a',
    o: '-o',
  };
  const values = {
    a: updateSelectedUser('octocat'),
    // without reducer, selectedUser state will not be updated by action.
    o: fetchRepos('user-in-state'),
  };

  it('should listen to UPDATE_SELECTED_USER action and signal fetching repos successfully', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ hot, expectObservable }) => {
      const action$ = hot(marbles.a, values) as any;
      const state$ = new StateObservable(new Subject<AppState>(), {
        selectedUser: 'user-in-state',
        githubRepos: reposInitialState,
        githubUsers: usersInitialState,
      }) as any;
      const dependencies = null;
      const output$ = listenToSelectedUserEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });
});
