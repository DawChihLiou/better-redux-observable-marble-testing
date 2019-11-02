import { UPDATE_SELECTED_USER, UpdateSelectedUserAction } from './types';

export function updateSelectedUser(payload: string): UpdateSelectedUserAction {
  return {
    type: UPDATE_SELECTED_USER,
    payload,
  };
}
