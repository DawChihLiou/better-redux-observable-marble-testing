import { createStore, Store, applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import { FetchGithubUsersActionTypes } from './githubUsers';
import rootReducer from './rootReducer';
import { rootEpic } from './rootEpic';
import { ajax } from 'rxjs/ajax';

const epicMiddleware = createEpicMiddleware({
  dependencies: { getJSON: ajax.getJSON },
});

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
