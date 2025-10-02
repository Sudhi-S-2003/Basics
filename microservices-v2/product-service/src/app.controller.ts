import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('product.get_by_id')
  async getProduct(data: { productId: string }) {
    return this.appService.getProductById(data.productId);
  }

  @MessagePattern('product.get_all')
  async getAllProducts(data: { page?: number; limit?: number }) {
    return this.appService.getAllProducts(data.page, data.limit);
  }

  @MessagePattern('product.create')
  async createProduct(data: any) {
    return this.appService.createProduct(data);
  }

  @MessagePattern('product.update')
  async updateProduct(data: { productId: string; updates: any }) {
    return this.appService.updateProduct(data.productId, data.updates);
  }

  @MessagePattern('product.delete')
  async deleteProduct(data: { productId: string }) {
    return this.appService.deleteProduct(data.productId);
  }

  @MessagePattern('product.check_stock')
  async checkStock(data: { productId: string; quantity: number }) {
    return this.appService.checkStock(data.productId, data.quantity);
  }
}