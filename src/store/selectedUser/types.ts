import { Action } from 'redux';

export const UPDATE_SELECTED_USER = 'UPDATE_SELECTED_USER';

export interface UpdateSelectedUserAction
  extends Action<typeof UPDATE_SELECTED_USER> {
  payload: string;
}

export type SelectedUserState = string;
