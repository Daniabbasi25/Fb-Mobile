import {FBUser} from '../../models/User';
import {FBLocale, UserPermissionAnswer} from './reducer';
import {FBGeoLocation} from '../../models/FBGeoLocation';

export type UserActionType = string;

export interface UserAction {
  type: UserActionType;
  data: any;
}

export const USER_UNSET_USER: UserActionType = 'UNSET_USER';

export interface UserUnsetUserAction extends UserAction {
}

export const userUnsetUserAction = (): UserUnsetUserAction => {
  return {
    type: USER_UNSET_USER,
    data: {},
  };
};

export const USER_SET_USER: UserActionType = 'SET_USER';

export interface UserSetUserAction extends UserAction {
  data: { user: FBUser };
}

export const userSetUserAction = (params: UserSetUserAction['data']): UserSetUserAction => {
  return {
    type: USER_SET_USER,
    data: params,
  };
};

export const USER_UPDATE_PROFILE: UserActionType = 'UPDATE_PROFILE';

export interface UserUpdateProfileAction extends UserAction {
  data: { user: FBUser };
}

export const userUpdateProfileAction = (params: UserUpdateProfileAction['data']): UserUpdateProfileAction => {
  return {
    type: USER_UPDATE_PROFILE,
    data: params,
  };
};

export const USER_UPDATE_LOCALE: UserActionType = 'UPDATE_LOCALE';

export interface UserUpdateLocaleAction extends UserAction {
  data: { locale: FBLocale };
}

export const userUpdateLocaleAction = (params: UserUpdateLocaleAction['data']): UserUpdateLocaleAction => {
  return {
    type: USER_UPDATE_LOCALE,
    data: params,
  };
};

export const USER_UPDATE_LOCATION: UserActionType = 'UPDATE_LOCATION';

export interface UserUpdateLocationAction extends UserAction {
  data: { userLocation: FBGeoLocation };
}

export const userUpdateLocationAction = (params: UserUpdateLocationAction['data']): UserUpdateLocationAction => {
  return {
    type: USER_UPDATE_LOCATION,
    data: params,
  };
};

export const USER_UPDATE_LOC_PERMISSION: UserActionType = 'UPDATE_LOC_PERMISSION';

export interface UserUpdateLocPermissionAction extends UserAction {
  data: { userAnswer: UserPermissionAnswer };
}

export const userUpdateLocPermissionAction = (params: UserUpdateLocPermissionAction['data']) => {
  return {
    type: USER_UPDATE_LOC_PERMISSION,
    data: params,
  };
};

export const USER_UPDATE_NOTIFICATION_PERMISSION: UserActionType = 'UPDATE_NOTIFICATION_PERMISSION';

export interface UserUpdateNotificationPermission extends UserAction {
  data: { userAnswer?: UserPermissionAnswer };
}

export const userUpdateNotificationPermissionAction = (params: UserUpdateNotificationPermission['data']): UserUpdateNotificationPermission => {
  return {
    type: USER_UPDATE_NOTIFICATION_PERMISSION,
    data: params,
  };
};
