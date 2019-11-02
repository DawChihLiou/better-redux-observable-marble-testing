import { combineReducers } from 'redux';
import { githubUsersReducer } from './githubUsers';
import { githubReposReducer } from './githubRepos';
import { selectedUserReducer } from './selectedUser/reducer';

const rootReducer = combineReducers({
  githubUsers: githubUsersReducer,
  githubRepos: githubReposReducer,
  selectedUser: selectedUserReducer,
});

export default rootReducer;
