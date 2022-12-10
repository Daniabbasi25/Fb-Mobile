import {FBOrder} from '../../models/FBOrder';

export type OrderActionType = string;

export interface OrderAction {
  type: OrderActionType;
  data: any;
}

export const ORDERS_FETCHED: OrderActionType = 'ORDERS_FETCH';

export interface OrdersFetchedAction extends OrderAction {
  data: { orders: FBOrder[] };
}

export const ordersFetchedAction = (params: OrdersFetchedAction['data']): OrdersFetchedAction => {
  return {
    type: ORDERS_FETCHED,
    data: params,
  };
};

export const ORDER_CANCELLED: OrderActionType = 'ORDER_CANCELLED';

export interface OrderCancelledAction extends OrderAction {
  data: { orderId: number };
}

export const orderCancelledAction = (params: OrderCancelledAction['data']): OrderCancelledAction => {
  return {
    type: ORDER_CANCELLED,
    data: params,
  };
};

export const ORDER_CONFIRMED: OrderActionType = 'ORDER_CONFIRMED';

export interface OrderConfirmedAction extends OrderAction {
  data: { orderId: number };
}

export const orderConfirmedAction = (params: OrderConfirmedAction['data']): OrderConfirmedAction => {
  return {
    type: ORDER_CONFIRMED,
    data: params,
  };
};

export const ORDER_RESET: OrderActionType = 'ORDER_RESET';

export interface OrderResetAction extends OrderAction {}

export const orderResetAction = (): OrderResetAction => {
  return {
    type: ORDER_RESET,
    data: undefined
  }
}
