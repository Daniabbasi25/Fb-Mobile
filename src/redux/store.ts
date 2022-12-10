import {combineReducers} from 'redux';
import userReducer, {UserState} from './user/reducer';
import restaurantReducer, {RestaurantState} from './restaurant/reducer';
import ordersReducer, {OrdersState} from './order/reducer';

export interface FBRootState {
  userState: UserState,
  restaurantState: RestaurantState,
  ordersState: OrdersState
}

const allReducer = combineReducers<FBRootState>({
  userState: userReducer,
  restaurantState: restaurantReducer,
  ordersState: ordersReducer,
});

export default allReducer;
