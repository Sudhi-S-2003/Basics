import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_product')
  getProduct(data: { productId: number }): any {
    return this.appService.getProductById(data.productId);
  }
}