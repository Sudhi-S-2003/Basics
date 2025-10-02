import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('order.create')
  createOrder(data: {
    token: string;
    productId: string;
    quantity: number;
    shippingAddress?: any;
  }) {
    return this.appService.createOrder(data);
  }

  @MessagePattern('order.get_by_id')
  getOrder(data: { orderId: string }) {
    return this.appService.getOrderById(data.orderId);
  }

  @MessagePattern('order.get_user_orders')
  getUserOrders(data: { userId: string; page?: number; limit?: number }) {
    return this.appService.getUserOrders(data.userId, data.page, data.limit);
  }

  @MessagePattern('order.update_status')
  updateOrderStatus(data: { orderId: string; status: string }) {
    return this.appService.updateOrderStatus(data.orderId, data.status);
  }

  @MessagePattern('order.cancel')
  cancelOrder(data: { orderId: string }) {
    return this.appService.cancelOrder(data.orderId);
  }
}