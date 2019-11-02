import {
  combineReducers,
  createStore,
  Store,
  applyMiddleware,
  Middleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { githubUsersReducer } from './reducer';
import { FetchGithubUsersActionTypes } from './types';
import { fetchGithubUserEpic } from './epic';

export const rootEpic = combineEpics(fetchGithubUserEpic);

const rootReducer = combineReducers({
  githubUsers: githubUsersReducer,
});

const epicMiddleware = createEpicMiddleware();

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(): Store<
  AppState,
  FetchGithubUsersActionTypes
> {
  const middlewares: Middleware[] = [epicMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, composedEnhancers);

  epicMiddleware.run(rootEpic);

  return store;
}
