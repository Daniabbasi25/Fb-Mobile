import {
  RestaurantAction,
  RestaurantActionType,
  RestaurantDistanceUpdateAction,
  RestaurantFetchAction,
  RestaurantUpdateFiltersAction,
  UpdateRestaurantSortOrderAction,
} from './actions';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import getDistanceToLocation from '../../utils/getDistanceToLocation';
import {toShowRestaurant} from '../../utils/toShowRestaurant';
import {DIET_TYPE, FOOD_TYPE} from '../../models';

export interface FBRestaurantFilters {
  canCheckout: {
    isEnabled: boolean;
    canCheckout: boolean;
  };
  pickUpPeriod: {
    isEnabled: boolean;
    pickUpStartTimeLowerLimit: number;
    pickUpEndTimeUpperLimit: number;
  };
  foodType: {
    isEnabled: boolean;
    types: FOOD_TYPE[];
  };
  dietType: {
    isEnabled: boolean;
    types: DIET_TYPE[];
  };
  search: {
    isEnabled: boolean;
    userInput: string;
  };
}

export enum RESTAURANT_SORT_OPTION {
  LOWEST_PRICE_FIRST = 'lowest_price_first',
  CLOSEST_DISTANCE_FIRST = 'closest_distance_first',
  // STARTING_SOONEST_FIRST = 'starting_soonest_first',
  // CLOSING_SOONEST_FIRST = 'closing_soonest_first'
}

export interface RestaurantSortFunction {
  (r1: RestaurantHomeListItem, r2: RestaurantHomeListItem): number;
}

export const RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION: { [key in RESTAURANT_SORT_OPTION]: RestaurantSortFunction } = {
  [RESTAURANT_SORT_OPTION.LOWEST_PRICE_FIRST]: (r1, r2) => r1.priceAfaterDiscount - r2.priceAfaterDiscount,
  [RESTAURANT_SORT_OPTION.CLOSEST_DISTANCE_FIRST]: (r1, r2) => r1.distance - r2.distance,
  // [RESTAURANT_SORT_OPTION.STARTING_SOONEST_FIRST]: (r1, r2) => r1.openTime - r2.openTime, // TODO: this should take into account current hour
  // [RESTAURANT_SORT_OPTION.CLOSING_SOONEST_FIRST]: (r1, r2) => r1.closeTime - r2.closeTime,// TODO: this should take into account current hour
};

export interface RestaurantState {
  filters: FBRestaurantFilters,
  sortOrder: RESTAURANT_SORT_OPTION,
  allRestaurants: RestaurantHomeListItem[],
  forList: RestaurantHomeListItem[],
  forMap: RestaurantHomeListItem[]
}

export const restaurantInitialState: RestaurantState = {
  allRestaurants: [],
  filters: {
    canCheckout: {
      isEnabled: true,
      canCheckout: true,
    },
    pickUpPeriod: {
      isEnabled: true,
      pickUpStartTimeLowerLimit: new Date(new Date().setHours(1, 0, 1)).getTime(),
      pickUpEndTimeUpperLimit: new Date(new Date().setHours(23, 59, 59)).getTime(),
    },
    foodType: {
      isEnabled: true,
      types: [FOOD_TYPE.GROCERIES, FOOD_TYPE.OTHERS, FOOD_TYPE.MEALS, FOOD_TYPE.PASTRIES],
    },
    dietType: {
      isEnabled: true,
      types: [],
    },
    search: {
      isEnabled: true,
      userInput: '',
    },
  },
  sortOrder: RESTAURANT_SORT_OPTION.CLOSEST_DISTANCE_FIRST,
  forList: [],
  forMap: [],
};

interface RestaurantActionHandler {
  (state: RestaurantState, data: any): RestaurantState;
}

const handleUpdateRestaurantDistanceToUserAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantDistanceUpdateAction['data']): RestaurantState => {

  const allRestaurants: RestaurantHomeListItem[] = [];
  const filteredRestaurants: RestaurantHomeListItem[] = [];

  // update distance to all restaurants
  for (const restaurant of state.allRestaurants) {
    restaurant.distance = getDistanceToLocation({
      userLocation: data.userLocation,
      location: {latitude: restaurant.latitude, longitude: restaurant.longitude},
    });
    allRestaurants.push(restaurant);

    if (toShowRestaurant(restaurant, state.filters)) {
      filteredRestaurants.push(restaurant);
    }
  }

  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[state.sortOrder]);

  return {
    ...state,
    allRestaurants: allRestaurants,
    forList: filteredRestaurants,
    forMap: allRestaurants,
  };
};

const handleRestaurantFetchedAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantFetchAction['data']): RestaurantState => {

  const filteredRestaurants: RestaurantHomeListItem[] = [];

  for (const restaurant of data.restaurants) {
    if (toShowRestaurant(restaurant, state.filters)) {
      filteredRestaurants.push(restaurant);
    }
  }

  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[state.sortOrder]);

  return {
    ...state,
    allRestaurants: data.restaurants,
    forList: filteredRestaurants,
    forMap: data.restaurants,
  };
};

const handleRestaurantUpdateFiltersAction: RestaurantActionHandler = (state: RestaurantState, data: RestaurantUpdateFiltersAction['data']): RestaurantState => {
  
  const newState = {...state};
  
  // @ts-ignore
  newState.filters[data.filterCategory][data.filterCategoryProperty] = data.newValue;

  // find new filtered restaurants
  const filteredRestaurants: RestaurantHomeListItem[] = [];
  for (const restaurant of newState.allRestaurants) {
    if (toShowRestaurant(restaurant, newState.filters)) {
      filteredRestaurants.push(restaurant);
    }
  }

  // sort them
  filteredRestaurants.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[newState.sortOrder]);

  return {
    ...newState,
    forList: filteredRestaurants,
  };
};

const handleUpdateRestaurantSortOrderAction: RestaurantActionHandler = (state, data: UpdateRestaurantSortOrderAction['data']): RestaurantState => {
  state.sortOrder = data.sortOrder;
  state.forList.sort(RESTAURANT_SORT_OPTION_TO_SORT_FUNCTION[data.sortOrder]);

  return {
    ...state,
  };
};

const handleRestaurantResetAction: RestaurantActionHandler = (state, _data: any) => {
  state.allRestaurants = [];
  state.forList = [];
  state.forMap = [];

  return {...state};
};

const RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP: { [p in RestaurantActionType]: RestaurantActionHandler } = {
  [RestaurantActionType.UPDATE_RESTAURANT_DISTANCE_TO_USER]: handleUpdateRestaurantDistanceToUserAction,
  [RestaurantActionType.RESTAURANT_FETCHED]: handleRestaurantFetchedAction,
  [RestaurantActionType.RESTAURANT_UPDATE_FILTERS]: handleRestaurantUpdateFiltersAction,
  [RestaurantActionType.UPDATE_RESTAURANT_SORT_ORDER]: handleUpdateRestaurantSortOrderAction,
  [RestaurantActionType.RESTAURANT_RESET]: handleRestaurantResetAction,
};

const restaurantReducer = (
  state: RestaurantState = restaurantInitialState,
  action: RestaurantAction,
): RestaurantState => {
  if (RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP[action.type]) {
    return RESTAURANT_ACTION_TO_ACTION_HANDLER_MAP[action.type](state, action.data);
  }

  return state;
};

export default restaurantReducer;
