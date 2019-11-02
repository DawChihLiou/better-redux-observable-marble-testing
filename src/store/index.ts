import {
  combineReducers,
  createStore,
  Store,
  applyMiddleware,
  Middleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { githubUsersReducer } from './reducer';
import { GithubUsersState, FetchGithubUsersActionTypes } from './types';

const rootReducer = combineReducers({
  githubUsers: githubUsersReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(): Store<
  AppState,
  FetchGithubUsersActionTypes
> {
  const middlewares: Middleware[] = [];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, composedEnhancers);

  return store;
}
