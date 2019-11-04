import { TestScheduler } from 'rxjs/testing';
import { fetchReposSuccessful, fetchReposFailed } from './actions';
import { GithubRepoType } from './types';
import { ajax } from 'rxjs/ajax';
import { of, throwError } from 'rxjs';
import { fetchGithubReposEpic, fetchGithubRepos } from './epic';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { map, catchError, delay } from 'rxjs/operators';

describe('fetchGithubRepos', () => {
  const response: GithubRepoType[] = [];
  const error = new Error('test error');
  const values = {
    r: response,
    x: error,
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
});
