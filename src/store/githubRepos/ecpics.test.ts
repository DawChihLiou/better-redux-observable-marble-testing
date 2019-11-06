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

const deepEqual = (actual: any, expected: any): void => {
  expect(actual).toEqual(expected);
};

describe('fetchGithubRepos', () => {
  const response: GithubRepoType[] = [];
  const error = new Error('test error');

  it('should signal fetching repos successfully', () => {
    const scheduler = new TestScheduler(deepEqual);
    const marbles = {
      i: '-i', // input api response
      o: '-o', // output action
    };
    const values = {
      i: response,
      o: fetchReposSuccessful(response),
    };

    scheduler.run(({ cold, expectObservable }) => {
      const getJSON = (url: string) => cold(marbles.i, values);
      const output$ = fetchGithubRepos('octocat', getJSON as any);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });

  it('should signal fetching repos has failed', () => {
    const scheduler = new TestScheduler(deepEqual);
    const marbles = {
      d: '-|', // mock api response time duration
      o: '-(o|)', // output action
    };
    const values = {
      o: fetchReposFailed(error),
    };

    scheduler.run(({ expectObservable }) => {
      const duration = scheduler.createTime(marbles.d);
      const getJSON = (url: string) =>
        timer(duration).pipe(mergeMap(() => throwError(error)));

      const output$ = fetchGithubRepos('octocat', getJSON as any);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });
});

describe('fetchGithubReposEpic', () => {
  const response: GithubRepoType[] = [];
  const error = new Error('test error');

  it('should signal fetching repos successfully', () => {
    const scheduler = new TestScheduler(deepEqual);
    const marbles = {
      i: '-i', // input action
      r: '--r', // mock api response
      o: '---o', // output action
    };
    const values = {
      i: fetchRepos('octocat'),
      r: response,
      o: fetchReposSuccessful(response),
    };

    scheduler.run(({ cold, expectObservable }) => {
      const action$ = cold(marbles.i, values) as any;
      const state$ = null as any;
      const dependencies = {
        getJSON: (url: string) => cold(marbles.r, values),
      };
      const output$ = fetchGithubReposEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });

  it('should cancel fetching properly and only emit output action once the previous fetch has fulfilled', () => {
    const scheduler = new TestScheduler(deepEqual);
    const marbles = {
      r: '--(r|)', // mock api response
      i: '-ii--(i|)', // input action
      // == switchMap() ==
      // '----r--(r|)'
      o: '----o--(o|)', // output action
    };
    const values = {
      i: fetchRepos('octocat'),
      r: response,
      o: fetchReposSuccessful(response),
    };

    scheduler.run(({ cold, expectObservable }) => {
      const action$ = cold(marbles.i, values) as any;
      const state$ = null as any;
      const dependencies = {
        getJSON: (url: string) => cold(marbles.r, values),
      };
      const output$ = fetchGithubReposEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });

  it('should signal fetching repos has failed', () => {
    const scheduler = new TestScheduler(deepEqual);
    const marbles = {
      i: '-(i|)', // input action
      d: '--|', // mock api response time duration
      o: '---(o|)', // output action
    };
    const values = {
      i: fetchRepos('octocat'),
      o: fetchReposFailed(error),
    };

    scheduler.run(({ cold, expectObservable }) => {
      const action$ = cold(marbles.i, values) as any;
      const state$ = null as any;
      const duration = scheduler.createTime(marbles.d);
      const dependencies = {
        getJSON: (url: string) =>
          timer(duration).pipe(mergeMap(() => throwError(error))),
      };
      const output$ = fetchGithubReposEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });

  it('should cancel fetching properly and only emit output action once the previous fetch has completed (failed)', () => {
    const scheduler = new TestScheduler(deepEqual);
    const marbles = {
      d: '--|', // mock api response time duration
      i: '-ii--(i|)', // input action
      o: '----o--(o|)', // output action
    };
    const values = {
      i: fetchRepos('octocat'),
      o: fetchReposFailed(error),
    };

    scheduler.run(({ cold, expectObservable }) => {
      const action$ = cold(marbles.i, values) as any;
      const state$ = null as any;
      const duration = scheduler.createTime(marbles.d);
      const dependencies = {
        getJSON: (url: string) =>
          timer(duration).pipe(mergeMap(() => throwError(error))),
      };
      const output$ = fetchGithubReposEpic(action$, state$, dependencies);
      expectObservable(output$).toBe(marbles.o, values);
    });
  });
});

describe('listenToSelectedUserEpic', () => {
  const marbles = {
    i: '-i--(i|)', // input action
    o: '-o--(o|)', // output action
  };
  const values = {
    i: updateSelectedUser(''),
    o: fetchRepos('user-in-state'), // without reducer, selectedUser state will not be updated by input action.
  };

  it('should listen to UPDATE_SELECTED_USER action and signal fetching repos successfully', () => {
    const scheduler = new TestScheduler(deepEqual);

    scheduler.run(({ cold, expectObservable }) => {
      const action$ = cold(marbles.i, values) as any;
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
