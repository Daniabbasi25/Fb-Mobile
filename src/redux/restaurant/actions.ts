import {RestaurantHomeListItem} from '../../models/Restaurant';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {RESTAURANT_SORT_OPTION} from './reducer';

export enum RestaurantActionType {
  RESTAURANT_UPDATE_FILTERS = 'RESTAURANT_UPDATE_FILTERS',
  RESTAURANT_FETCHED = 'RESTAURANT_FETCHED',
  UPDATE_RESTAURANT_DISTANCE_TO_USER = 'UPDATE_RESTAURANT_DISTANCE_TO_USER' ,
  UPDATE_RESTAURANT_SORT_ORDER = 'UPDATE_RESTAURANT_SORT_ORDER',
  RESTAURANT_RESET = 'RESTAURANT_RESET'
}

export interface RestaurantAction {
  type: RestaurantActionType;
  data: any;
}

export interface RestaurantUpdateFiltersAction extends RestaurantAction {
  data: { filterCategory: string; filterCategoryProperty: string; newValue: any; };
}

export const restaurantUpdateFiltersAction = (params: RestaurantUpdateFiltersAction['data']): RestaurantUpdateFiltersAction => {
  return {
    type: RestaurantActionType.RESTAURANT_UPDATE_FILTERS,
    data: params,
  };
};

export interface RestaurantFetchAction extends RestaurantAction {
  data: { restaurants: RestaurantHomeListItem[] };
}

export const restaurantsFetchedAction = (params: RestaurantFetchAction['data']): RestaurantFetchAction => {
  return {
    type: RestaurantActionType.RESTAURANT_FETCHED,
    data: params,
  };
};

export interface RestaurantDistanceUpdateAction extends RestaurantAction {
  data: { userLocation: FBGeoLocation };
}

export const restaurantDistanceUpdateAction = (params: RestaurantDistanceUpdateAction['data']): RestaurantDistanceUpdateAction => {
  return {
    type: RestaurantActionType.UPDATE_RESTAURANT_DISTANCE_TO_USER,
    data: params,
  };
};

export interface UpdateRestaurantSortOrderAction extends RestaurantAction {
  data: { sortOrder: RESTAURANT_SORT_OPTION };
}

export const updateRestaurantSortOrderAction = (params: UpdateRestaurantSortOrderAction['data']): UpdateRestaurantSortOrderAction => {
  return {
    type: RestaurantActionType.UPDATE_RESTAURANT_SORT_ORDER,
    data: params,
  };
};

export interface RestaurantResetAction extends RestaurantAction {
}

export const restaurantResetAction = (): RestaurantResetAction => {
  return {
    type: RestaurantActionType.RESTAURANT_RESET,
    data: undefined,
  };
};
