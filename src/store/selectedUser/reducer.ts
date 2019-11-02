import { Reducer } from 'redux';
import {
  SelectedUserState,
  UpdateSelectedUserAction,
  UPDATE_SELECTED_USER,
} from './types';

export const selectedUserReducer: Reducer<
  SelectedUserState,
  UpdateSelectedUserAction
> = (state = '', action) => {
  switch (action.type) {
    case UPDATE_SELECTED_USER: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
