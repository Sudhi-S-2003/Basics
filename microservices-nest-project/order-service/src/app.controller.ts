import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_order')
  createOrder(data: { token: string; userId: number; productId: number }) {
    return this.appService.createOrder(data.token, data.userId, data.productId);
  }
}