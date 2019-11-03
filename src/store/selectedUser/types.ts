export const UPDATE_SELECTED_USER = 'UPDATE_SELECTED_USER';

export interface UpdateSelectedUserAction {
  type: typeof UPDATE_SELECTED_USER;
  payload: string;
}

export type SelectedUserState = string;
