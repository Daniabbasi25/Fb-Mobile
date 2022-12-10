import {BaseOrderRepository} from "../repositories/OrderRepository";


class OrderService {
  private orderRepository: BaseOrderRepository;

  constructor(params: {
    orderRepository: BaseOrderRepository
  }) {
    this.orderRepository = params.orderRepository;
  }
}

export {
  OrderService
}
