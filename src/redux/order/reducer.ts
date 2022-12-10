import {FBOrder} from '../../models/FBOrder';
import {
  ORDER_CANCELLED,
  ORDER_CONFIRMED, ORDER_RESET,
  OrderAction,
  OrderCancelledAction, OrderConfirmedAction,
  ORDERS_FETCHED,
  OrdersFetchedAction,
} from './actions';

export interface OrdersState {
  orders: FBOrder[];
}

export const ordersInitialState: OrdersState = {
  orders: [],
};

const handleOrdersFetchedAction = (state: OrdersState, data: OrdersFetchedAction['data']): OrdersState => {
  return {
    ...state,
    orders: data.orders,
  };
};

const handleOrderCancelledAction = (state: OrdersState, data: OrderCancelledAction['data']): OrdersState => {
  for (let order of state.orders) {
    if (order.id === data.orderId) {
      order.status = 2;
      break;
    }
  }

  return {
    ...state,
    orders: state.orders,
  };
};

const handleOrderConfirmedAction = (state: OrdersState, data: OrderConfirmedAction['data']): OrdersState => {
  for (let order of state.orders) {
    if (order.id === data.orderId) {
      order.status = 1;
      break;
    }
  }

  return {
    ...state,
    orders: state.orders,
  };
};

const handleOrderResetAction = (state: OrdersState): OrdersState => {
  return {
    ...state,
    orders: [],
  };
};

const ordersReducer = (
  state: OrdersState = ordersInitialState,
  action: OrderAction,
): OrdersState => {

  switch (action.type) {
    case ORDERS_FETCHED: {
      return handleOrdersFetchedAction(state, action.data);
    }
    case ORDER_CANCELLED: {
      return handleOrderCancelledAction(state, action.data);
    }
    case ORDER_CONFIRMED: {
      return handleOrderConfirmedAction(state, action.data);
    }
    case ORDER_RESET : {
      return handleOrderResetAction(state);
    }

    default:
      return state;

  }
};

export default ordersReducer;
