import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto, GetOrdersDto } from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(data: CreateOrderDto) {
    return await this.orderService.createOrder(data);
  }

  @MessagePattern({ cmd: 'get_orders' })
  async getOrders(data: GetOrdersDto) {
    console.log("toching order service")
    return await this.orderService.getOrders(data);
  }
}