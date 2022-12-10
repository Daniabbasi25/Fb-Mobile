import {FBBaseError} from '../common/FBBaseError';
import {AuthData} from '../models/AuthData';
import {FBUserVoucher} from '../models/FBUserVoucher';
import axiosClient from '../network/axiosClient';
import QueryString from 'query-string';
import {FBOrder, FBOrderMapper} from '../models/FBOrder';
import {analyticsCheckoutStepChange} from '../analytics';
import {FBUser} from '../models/User';

export interface CreateOrderParams {
  restaurantId: number,
  numberOfBoxesInBasket: number,
  boxId: number,
  userVoucher: FBUserVoucher
}

export interface BaseOrderRepository {
  createOrder(params: CreateOrderParams): Promise<{ isCreated: boolean, pin: string }>;

  getAll(params: {}): Promise<FBOrder[]>;

  cancelOrder(params: { orderId: number }): Promise<boolean>;

  confirmOrder(params: { orderId: number }): Promise<boolean>;
}

class OrderRepositoryError extends FBBaseError {
}

class OrderRepository implements BaseOrderRepository {
  private authData: AuthData;
  private user: FBUser;

  constructor(params: {
    authData: AuthData,
    user: FBUser
  }) {
    this.authData = params.authData;
    this.user = params.user;
  }

  async confirmOrder(params: { orderId: number }): Promise<boolean> {
    const url = '/user/confirm-order-completed/';
    
    const result: { success: boolean } = await axiosClient.patch(
      url,
      QueryString.stringify({
        orderId: params.orderId,
      }),
      {
        headers: {
          'x-access-token': this.authData.userToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return result.success;
  }

  async cancelOrder(params: { orderId: number }): Promise<boolean> {
    const url = '/user/orders/' + params.orderId;
    
    const result: { success: boolean } = await axiosClient.delete(
      url,
      {
        headers: {
          'x-access-token': this.authData.userToken,
        },
      },
    );

    return result.success;
  }

  async getAll(params: {}): Promise<FBOrder[]> {
    const url = '/user/orders';
    
    const result: { orders: any[] } = await axiosClient.get(
      url,
      {
        headers: {
          'x-access-token': this.authData.userToken,
        },
      },
    );

    return result.orders.map(o => FBOrderMapper.fromApi(o));
  
  }

  async createOrder(params: CreateOrderParams): Promise<{ isCreated: boolean, pin: string }> {
    const url = '/user/order/' + params.restaurantId;

    try {
      const responseData: { success: boolean, orderId: number, pin: string } = await axiosClient.post(
        url,
        QueryString.stringify({
          quantity: params.numberOfBoxesInBasket,
          productId: params.boxId,
          voucherCode: params.userVoucher,
        }),
        {
          headers: {
            'x-access-token': this.authData.userToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      
      return {
        isCreated: responseData.success,
        pin: responseData.pin,
      };
    } catch (e: any) {
      analyticsCheckoutStepChange({
        userId: this.user.id,
        email: this.user.email,
        productId: params.boxId,
        quantity: params.numberOfBoxesInBasket,
        voucher: params.userVoucher,
        step: 'failed',
        error: e.response?.data.message,
      });
      
      throw e;
    }
  }

}

export {
  OrderRepository,
  OrderRepositoryError,
};
