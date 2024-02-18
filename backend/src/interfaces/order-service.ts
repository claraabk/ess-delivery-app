import { Order, OrderDetails } from 'src/orders/entities/order';

export abstract class OrderService {
  abstract create(order: Order): Promise<Order>;
  abstract findOne(id: string): Promise<OrderDetails>;
  abstract delete(id: string): Promise<void>;
}
